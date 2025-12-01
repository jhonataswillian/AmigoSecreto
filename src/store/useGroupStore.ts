import { create } from "zustand";
import type { Group, Participant, WishlistItem } from "../types";
import { supabase } from "../lib/supabase";

interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;

  createGroup: (
    group: Omit<Group, "id" | "participants" | "status">,
  ) => Promise<string>;
  getGroup: (id: string) => Promise<void>;
  inviteUser: (groupId: string, identifier: string) => Promise<void>;
  addParticipant: (
    groupId: string,
    participant: Partial<Participant>,
  ) => Promise<void>;
  removeParticipant: (groupId: string, participantId: string) => Promise<void>;
  updateParticipant: (
    groupId: string,
    participantId: string,
    data: Partial<Participant>,
  ) => Promise<void>;
  draw: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  transferOwnership: (groupId: string, newOwnerId: string) => Promise<void>;
  fetchGroups: () => Promise<void>;
  createInvite: (groupId: string) => Promise<string>;
  getInviteInfo: (
    code: string,
  ) => Promise<{ groupName: string; ownerName: string; ownerHandle: string }>;
  joinByInvite: (code: string) => Promise<string>;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  currentGroup: null,
  isLoading: false,

  fetchGroups: async () => {
    set({ isLoading: true });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch groups where I am owner OR member
    // We also fetch the count of members for the list view
    const { data, error } = await supabase
      .from("groups")
      .select("*, group_members(count)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching groups:", error);
      set({ isLoading: false });
      return;
    }

    // Map to Group type
    const groups: Group[] = data.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      ownerId: g.owner_id,
      eventDate: g.event_date,
      maxPrice: g.max_price,
      status: g.status,
      // Hack to make .length work without fetching all profiles
      participants: new Array(g.group_members[0]?.count || 0).fill(
        {} as Participant,
      ),
    }));

    set({ groups, isLoading: false });
  },

  createGroup: async (groupData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Safety timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Tempo limite excedido ao criar grupo.")),
        15000,
      ),
    );

    const createOperation = async () => {
      const { data, error } = await supabase
        .from("groups")
        .insert({
          name: groupData.name,
          description: groupData.description,
          event_date: groupData.eventDate,
          max_price: groupData.maxPrice,
          owner_id: user.id,
          status: "created",
        })
        .select()
        .single();

      if (error) throw error;

      // Add owner as admin member
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: data.id,
          user_id: user.id,
          is_admin: true,
        });

      if (memberError) {
        console.error(
          "Error adding owner to group, rolling back...",
          memberError,
        );
        // Attempt to cleanup
        await supabase.from("groups").delete().eq("id", data.id);
        throw new Error("Falha ao registrar permissões do grupo.");
      }

      // Refresh list
      get().fetchGroups();
      return data.id;
    };

    return Promise.race([createOperation(), timeoutPromise]) as Promise<string>;
  },

  getGroup: async (id) => {
    set({ isLoading: true });

    try {
      // Safety timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 15000),
      );

      const fetchPromise = (async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // 1. Fetch Group Details
        const { data: groupData, error: groupError } = await supabase
          .from("groups")
          .select("*")
          .eq("id", id)
          .single();

        if (groupError) throw groupError;

        // 2. Fetch Members
        const { data: membersData, error: membersError } = await supabase
          .from("group_members")
          .select("id, user_id, is_admin")
          .eq("group_id", id);

        if (membersError) throw membersError;

        // 3. Fetch Profiles and Wishlists manually to avoid relationship issues
        const userIds = membersData.map((m) => m.user_id);

        const [profilesResult, wishlistsResult] = await Promise.all([
          supabase.from("profiles").select("*").in("id", userIds),
          supabase.from("wishlist_items").select("*").in("user_id", userIds),
        ]);

        if (profilesResult.error) throw profilesResult.error;
        // Wishlist error is non-critical, can ignore or log
        if (wishlistsResult.error)
          console.error("Error fetching wishlists:", wishlistsResult.error);

        const profilesMap = new Map(profilesResult.data?.map((p) => [p.id, p]));
        const wishlistsMap = new Map();
        wishlistsResult.data?.forEach((w) => {
          if (!wishlistsMap.has(w.user_id)) wishlistsMap.set(w.user_id, []);
          wishlistsMap.get(w.user_id).push(w);
        });

        // 4. Fetch My Draw (if exists)
        let myMatchId: string | undefined;
        if (user && groupData.status === "drawn") {
          const { data: drawData } = await supabase
            .from("draws")
            .select("receiver_id")
            .eq("group_id", id)
            .eq("giver_id", user.id)
            .single();

          if (drawData) {
            myMatchId = drawData.receiver_id;
          }
        }

        // 5. Map to Participant Type
        const participants: Participant[] = membersData.map((m) => {
          const profile = profilesMap.get(m.user_id);
          const wishlist = wishlistsMap.get(m.user_id) || [];

          // Fallback if profile not found (shouldn't happen usually)
          if (!profile) {
            return {
              id: m.id,
              userId: m.user_id,
              name: "Usuário Desconhecido",
              handle: "",
              avatar: "",
              wishlist: [],
              // isAdmin: m.is_admin // Type definition might not have it yet, but we can add it
            } as Participant;
          }

          return {
            id: m.id, // group_member id
            userId: profile.id,
            name: profile.name,
            handle: profile.handle,
            avatar: profile.avatar,
            frame: profile.frame,
            wishlist: wishlist.map((w: WishlistItem) => ({
              id: w.id,
              name: w.name,
              description: w.description,
              price: w.price,
              link: w.link,
            })),
            // isAdmin: m.is_admin,
          };
        });

        // 6. Link the draw match
        if (myMatchId) {
          const myParticipantIndex = participants.findIndex(
            (p) => p.userId === user?.id,
          );
          const receiverParticipant = participants.find(
            (p) => p.userId === myMatchId,
          );

          if (myParticipantIndex !== -1 && receiverParticipant) {
            participants[myParticipantIndex].assignedToId =
              receiverParticipant.id;
          }
        }

        const currentGroup: Group = {
          id: groupData.id,
          name: groupData.name,
          description: groupData.description,
          ownerId: groupData.owner_id,
          eventDate: groupData.event_date,
          maxPrice: groupData.max_price,
          status: groupData.status,
          participants,
        };

        set({ currentGroup });
      })();

      await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error) {
      console.error("Error in getGroup:", error);
      // Don't clear currentGroup on error to avoid flickering if it was just a refresh
    } finally {
      set({ isLoading: false });
    }
  },

  inviteUser: async (groupId, identifier) => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    if (!currentUser) throw new Error("User not authenticated");

    // 1. Find User
    // We only search by handle now
    let searchHandle = identifier.trim();
    if (!searchHandle.startsWith("@")) {
      searchHandle = `@${searchHandle}`;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, name")
      .ilike("handle", searchHandle)
      .maybeSingle();

    if (error) console.error(error);
    if (!profile)
      throw new Error(
        `Usuário "${searchHandle}" não encontrado. Verifique o @handle.`,
      );

    // 2. Check if already member
    const { data: existing } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", profile.id)
      .maybeSingle();

    if (existing) throw new Error("Usuário já está no grupo.");

    // 3. Get Group Name for message
    const { data: group } = await supabase
      .from("groups")
      .select("name")
      .eq("id", groupId)
      .single();

    // 4. Send Notification
    const { error: notifError } = await supabase.from("notifications").insert({
      user_id: profile.id,
      type: "invite",
      title: "Convite para Grupo",
      message: `Você foi convidado para participar do grupo "${group?.name || "Amigo Secreto"}".`,
      data: { groupId, groupName: group?.name },
    });

    if (notifError) throw notifError;
  },

  addParticipant: async (groupId, participantData) => {
    // This is now used when ACCEPTING an invite (or direct add if we kept it)
    // participantData might just need userId now if we have it.
    // But let's keep compatibility or update it.
    // If we accept invite, we know the userId.

    let userIdToAdd = participantData.userId;

    if (!userIdToAdd) {
      // Fallback to search if userId not provided (legacy direct add)
      const identifier = participantData.handle;
      if (!identifier) throw new Error("Handle required");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("handle", identifier)
        .single();

      if (profile) userIdToAdd = profile.id;
      else throw new Error("Usuário não encontrado.");
    }

    // Check if already in group
    const { data: existing } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", userIdToAdd)
      .maybeSingle();

    if (existing) throw new Error("Usuário já está no grupo.");

    // Add to group_members
    const { error } = await supabase.from("group_members").insert({
      group_id: groupId,
      user_id: userIdToAdd,
    });

    if (error) throw error;

    // Refresh group
    get().getGroup(groupId);
  },

  removeParticipant: async (groupId, participantId) => {
    // Notify user
    const { data: member } = await supabase
      .from("group_members")
      .select("user_id, groups(name)")
      .eq("id", participantId)
      .single();

    if (member) {
      await supabase.from("notifications").insert({
        user_id: member.user_id,
        type: "warning",
        title: "Removido do Grupo",
        message: `Você foi removido do grupo "${(member.groups as unknown as { name: string }[])?.[0]?.name || "Amigo Secreto"}".`,
      });
    }

    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("id", participantId);

    if (error) throw error;

    get().getGroup(groupId);
  },

  updateParticipant: async (groupId, _participantId, _data) => {
    // This is mostly for local state updates in the mock.
    // In real app, profile updates are done via useAuthStore.
    // But if we have group-specific data (like gift ideas?), we would update here.
    // For now, we just refresh the group.
    console.log("Update participant pending:", _participantId, _data);
    get().getGroup(groupId);
  },

  draw: async (groupId) => {
    const { currentGroup } = get();
    if (!currentGroup) return;

    // 1. Get all members (profiles)
    // We need the user_ids to create the pairs
    const participants = currentGroup.participants;
    if (participants.length < 2) throw new Error("Mínimo de 2 participantes.");

    const userIds = participants.map((p) => p.userId!).filter(Boolean);

    // 2. Shuffle
    let shuffled = [...userIds];
    let valid = false;
    // Simple derangement shuffle
    while (!valid) {
      shuffled = shuffled.sort(() => Math.random() - 0.5);
      valid = userIds.every((id, i) => id !== shuffled[i]);
    }

    // 3. Prepare inserts
    const draws = userIds.map((giverId, i) => ({
      group_id: groupId,
      giver_id: giverId,
      receiver_id: shuffled[i],
    }));

    // 4. Transaction-like (Supabase doesn't have transactions in client, but we can do sequential)
    // Ideally use an RPC, but here we go:

    // Clear old draws (if any) - RLS allows owner to delete
    await supabase.from("draws").delete().eq("group_id", groupId);

    // Insert new draws
    const { error: drawError } = await supabase.from("draws").insert(draws);
    if (drawError) throw drawError;

    // Update group status
    const { error: updateError } = await supabase
      .from("groups")
      .update({ status: "drawn" })
      .eq("id", groupId);

    if (updateError) throw updateError;

    // Refresh
    get().getGroup(groupId);
  },

  transferOwnership: async (groupId, newOwnerId) => {
    const { currentGroup } = get();
    if (!currentGroup) return;

    // 0. VALIDATION: Check if the new owner is still a member
    const { data: memberCheck, error: memberCheckError } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", newOwnerId)
      .single();

    if (memberCheckError || !memberCheck) {
      throw new Error(
        "Este usuário não é mais membro do grupo. A lista de participantes pode estar desatualizada.",
      );
    }

    // 1. Update Admin Flags (Swap) - Do this FIRST while we are still owner
    await Promise.all([
      supabase
        .from("group_members")
        .update({ is_admin: false })
        .eq("group_id", groupId)
        .eq("user_id", currentGroup.ownerId),
      supabase
        .from("group_members")
        .update({ is_admin: true })
        .eq("group_id", groupId)
        .eq("user_id", newOwnerId),
    ]);

    // 2. Update Group Owner - Do this LAST
    const { error: groupError } = await supabase
      .from("groups")
      .update({ owner_id: newOwnerId })
      .eq("id", groupId);

    if (groupError) throw groupError;

    // 3. Notify new owner
    await supabase.from("notifications").insert({
      user_id: newOwnerId,
      type: "info",
      title: "Você é o novo Admin!",
      message: `Você agora é o administrador do grupo "${currentGroup.name}".`,
    });

    // Refresh
    get().getGroup(groupId);
  },

  deleteGroup: async (groupId) => {
    // Notify members
    const { data: group } = await supabase
      .from("groups")
      .select("name, owner_id")
      .eq("id", groupId)
      .single();
    const { data: members } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("group_id", groupId);

    if (group && members) {
      const notifications = members
        .filter((m) => m.user_id !== group.owner_id)
        .map((m) => ({
          user_id: m.user_id,
          type: "warning",
          title: "Grupo Excluído",
          message: `O grupo "${group.name}" foi excluído pelo administrador.`,
          read: false,
        }));

      if (notifications.length > 0) {
        await supabase.from("notifications").insert(notifications);
      }
    }

    const { error } = await supabase.from("groups").delete().eq("id", groupId);
    if (error) throw error;

    set((state) => ({
      groups: state.groups.filter((g) => g.id !== groupId),
      currentGroup: null,
    }));
  },

  leaveGroup: async (groupId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", user.id);

    if (error) throw error;

    set((state) => ({
      groups: state.groups.filter((g) => g.id !== groupId),
      currentGroup: null,
    }));
  },

  createInvite: async (groupId) => {
    // Check if existing valid invite
    const { data: existing } = await supabase
      .from("group_invites")
      .select("code")
      .eq("group_id", groupId)
      .maybeSingle();

    if (existing) return existing.code;

    // Create new
    const code = Math.random().toString(36).substring(2, 10); // Simple random code
    const { data, error } = await supabase
      .from("group_invites")
      .insert({
        group_id: groupId,
        code,
      })
      .select("code")
      .single();

    if (error) throw error;
    return data.code;
  },

  getInviteInfo: async (code) => {
    const { data, error } = await supabase.rpc("get_invite_details", {
      invite_code: code,
    });

    if (error) {
      console.error("Error fetching invite info:", error);
      throw new Error("Convite inválido ou expirado.");
    }

    // RPC returns an array (table), but we expect a single result since code is unique
    const invite = Array.isArray(data) ? data[0] : data;

    if (!invite) throw new Error("Convite não encontrado.");

    return {
      groupName: invite.group_name,
      ownerName: invite.owner_name || "Alguém",
      ownerHandle: invite.owner_handle || "",
    };
  },

  joinByInvite: async (code) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Você precisa estar logado.");

    // 1. Get invite info
    const { data: invite, error } = await supabase
      .from("group_invites")
      .select("group_id")
      .eq("code", code)
      .single();

    if (error || !invite) throw new Error("Convite inválido.");

    // 2. Check if already member
    const { data: existing } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", invite.group_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) return invite.group_id; // Already joined, just return ID

    // 3. Join
    const { error: joinError } = await supabase.from("group_members").insert({
      group_id: invite.group_id,
      user_id: user.id,
    });

    if (joinError) throw joinError;

    // Refresh list
    get().fetchGroups();

    return invite.group_id;
  },
}));
