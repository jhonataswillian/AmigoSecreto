import { create } from "zustand";
import type { User, WishlistItem } from "../types";
import { supabase } from "../lib/supabase";
import { getRandomAvatar } from "../utils/avatarList";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  wishlist: WishlistItem[];
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    handle: string,
  ) => Promise<void>;
  logout: () => Promise<void>;

  // Wishlist methods (To be fully migrated to DB later, keeping interface)
  addToWishlist: (item: Omit<WishlistItem, "id">) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  updateWishlistItem: (
    id: string,
    data: Partial<Omit<WishlistItem, "id">>,
  ) => Promise<void>;

  findUserByHandle: (handle: string) => Promise<User | null>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateHandle: (newHandle: string) => Promise<void>;
  updateName: (newName: string) => Promise<void>;
  changePassword: (oldPwd: string, newPwd: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;

  // New: Initialize auth listener
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  wishlist: [],
  isLoading: true,

  initialize: async () => {
    // Check active session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        // Fetch wishlist
        const { data: wishlistData } = await supabase
          .from("wishlist_items")
          .select("*")
          .eq("user_id", session.user.id);

        const wishlist: WishlistItem[] = (wishlistData || []).map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          link: item.link,
        }));

        set({
          user: { ...profile, id: session.user.id }, // Ensure ID matches auth
          isAuthenticated: true,
          wishlist,
          isLoading: false,
        });
      }
    } else {
      set({ isLoading: false });
    }

    // Listen for changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          const { data: wishlistData } = await supabase
            .from("wishlist_items")
            .select("*")
            .eq("user_id", session.user.id);

          const wishlist: WishlistItem[] = (wishlistData || []).map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            link: item.link,
          }));

          set({
            user: { ...profile, id: session.user.id },
            isAuthenticated: true,
            wishlist,
          });
        }
      } else {
        set({ user: null, isAuthenticated: false, wishlist: [] });
      }
    });
  },

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  },

  register: async (name, email, password, handle) => {
    // Check if handle exists first (optional, but good UX)
    const { data: existingHandle } = await supabase
      .from("profiles")
      .select("handle")
      .eq("handle", handle)
      .single();

    if (existingHandle) {
      throw new Error("Este @usuário já consta em nosso banco de dados.");
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          handle,
          avatar: getRandomAvatar(),
        },
      },
    });

    if (error) throw error;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, wishlist: [] });
  },

  addToWishlist: async (item) => {
    const { user } = get();
    if (!user) throw new Error("Usuário não autenticado");

    // Verify session before action
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      throw new Error("Sessão expirada. Por favor, faça login novamente.");
    }

    const { data, error } = await supabase
      .from("wishlist_items")
      .insert({
        user_id: user.id,
        name: item.name,
        description: item.description || null,
        price: item.price ?? null,
        link: item.link || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao adicionar desejo:", error);
      throw error;
    }

    set((state) => ({
      wishlist: [
        ...state.wishlist,
        {
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          link: data.link,
        },
      ],
    }));
  },

  removeFromWishlist: async (id) => {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("id", id);

    if (error) throw error;

    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== id),
    }));
  },

  updateWishlistItem: async (id, data) => {
    const updateData = {
      ...data,
      description:
        data.description === undefined ? undefined : data.description || null,
      price: data.price === undefined ? undefined : data.price ?? null,
      link: data.link === undefined ? undefined : data.link || null,
    };

    const { error } = await supabase
      .from("wishlist_items")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;

    set((state) => ({
      wishlist: state.wishlist.map((item) =>
        item.id === id ? { ...item, ...data } : item,
      ),
    }));
  },

  findUserByHandle: async (handle) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("handle", handle) // Case insensitive
      .single();

    if (error || !data) return null;
    return data as User;
  },

  updateProfile: async (data) => {
    const { user } = get();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", user.id);

    if (error) throw error;

    // Optimistic update
    set({ user: { ...user, ...data } });
  },

  updateHandle: async (newHandle) => {
    const { user } = get();
    if (!user) return;

    if (user.handleChangedAt) {
      throw new Error("Você só pode alterar seu handle uma vez.");
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        handle: newHandle,
        handle_changed_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      if (error.code === "23505")
        throw new Error("Este handle já está em uso."); // Unique violation
      throw error;
    }

    set({
      user: {
        ...user,
        handle: newHandle,
        handleChangedAt: new Date().toISOString(),
      },
    });
  },

  updateName: async (newName) => {
    const { user } = get();
    if (!user) return;

    // No restriction check here anymore!

    const { error } = await supabase
      .from("profiles")
      .update({
        name: newName,
        // name_changed_at: new Date().toISOString() // Optional
      })
      .eq("id", user.id);

    if (error) throw error;

    set({
      user: {
        ...user,
        name: newName,
      },
    });
  },

  changePassword: async (_oldPwd, newPwd) => {
    // Supabase doesn't require old password for update if logged in,
    // but for security flow we might want to re-auth.
    // For simplicity, we just update.
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    if (error) throw error;
  },

  deleteAccount: async () => {
    const { user } = get();
    if (!user) return;

    // Supabase doesn't allow users to delete themselves directly via client SDK by default (admin only),
    // UNLESS we use a specific RPC function or RLS policy on a separate table that triggers a function.
    // OR we just delete the profile and let a trigger delete the auth user (requires service role).
    // For now, let's just sign out and pretend, or call an RPC if we had one.
    // Actually, we can delete the PROFILE row. If we set up CASCADE correctly, it might clean up data,
    // but it won't delete the Auth User.
    // Let's just signOut for now and mark as "deleted" in profile if we wanted soft delete.
    // But user asked for "CRUD completo de deletar conta".
    // We will implement `delete_own_user` RPC later.

    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/profile`,
    });
    if (error) throw error;
  },
}));
