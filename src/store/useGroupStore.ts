import { create } from "zustand";
import type { Group, Participant } from "../types";

interface GroupState {
  /** List of all available groups */
  groups: Group[];
  /** The currently selected or active group */
  currentGroup: Group | null;
  
  /**
   * Creates a new group with the provided data.
   * @param group The group data (excluding id, participants, and status)
   * @returns The ID of the newly created group
   */
  createGroup: (
    group: Omit<Group, "id" | "participants" | "status">,
  ) => Promise<string>;

  /**
   * Sets the current group by ID.
   * @param id The ID of the group to retrieve
   */
  getGroup: (id: string) => void;

  /**
   * Adds a participant to a specific group.
   * @param groupId The ID of the group
   * @param participant The participant data
   */
  addParticipant: (
    groupId: string,
    participant: Omit<Participant, "id" | "wishlist">,
  ) => Promise<void>;

  /**
   * Removes a participant from a group.
   * @param groupId The ID of the group
   * @param participantId The ID of the participant to remove
   */
  removeParticipant: (groupId: string, participantId: string) => Promise<void>;

  /**
   * Updates a participant's information within a group.
   * @param groupId The ID of the group
   * @param participantId The ID of the participant to update
   * @param data The partial data to update
   */
  updateParticipant: (
    groupId: string,
    participantId: string,
    data: Partial<Participant>,
  ) => Promise<void>;

  /**
   * Performs the Secret Santa draw for a group.
   * Shuffles participants and assigns them to each other, ensuring no one draws themselves.
   * @param groupId The ID of the group to draw
   */
  draw: (groupId: string) => Promise<void>;

  /**
   * Deletes a group permanently.
   * @param groupId The ID of the group to delete
   */
  deleteGroup: (groupId: string) => Promise<void>;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [
    {
      id: "1",
      name: "Grupo Mock 1 (Vazio)",
      description: "Grupo para teste de convites.",
      ownerId: "1",
      participants: [],
      status: "created",
      maxPrice: 50,
      eventDate: "2025-12-25",
    },
    {
      id: "2",
      name: "Família Silva (Cheio)",
      description: "Grupo com participantes para teste de sorteio.",
      ownerId: "1",
      participants: [
        {
          id: "p1",
          name: "João Silva",
          email: "joao@email.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
          wishlist: [],
        },
        {
          id: "p2",
          name: "Maria Silva",
          email: "maria@email.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
          wishlist: [],
        },
        {
          id: "p3",
          name: "Pedro Santos",
          email: "pedro@email.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
          wishlist: [],
        },
        {
          id: "p4",
          name: "Ana Costa",
          email: "ana@email.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
          wishlist: [],
        },
        {
          id: "p5",
          name: "Carlos Oliveira",
          email: "carlos@email.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
          wishlist: [],
        },
        {
          id: "p6",
          name: "Beatriz Lima",
          email: "bia@email.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bia",
          wishlist: [],
        },
        {
          id: "p7",
          name: "Lucas Pereira",
          email: "lucas@email.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
          wishlist: [],
        },
        {
          id: "p8",
          name: "Fernanda Souza",
          email: "fernanda@email.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda",
          wishlist: [],
        },
        {
          id: "p9",
          name: "Rafael Almeida",
          email: "rafael@email.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael",
          wishlist: [],
        },
        {
          id: "p10",
          name: "Juliana Rocha",
          email: "ju@email.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana",
          wishlist: [],
        },
      ],
      status: "created",
      maxPrice: 100,
      eventDate: "2025-12-24",
    },
    {
      id: "3",
      name: "Amigo Secreto da Firma",
      description: "Festa da empresa 2025.",
      ownerId: "2",
      participants: [
        {
          id: "p1",
          name: "Chefe",
          email: "boss@email.com",
          avatar: "",
          wishlist: [],
        },
        {
          id: "p2",
          name: "Jhonatas",
          email: "admin@example.com",
          userId: "1",
          avatar: "",
          wishlist: [],
        },
      ],
      status: "created",
      maxPrice: 100,
      eventDate: "2025-12-20",
    },
  ],
  currentGroup: null,

  createGroup: async (groupData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newGroup: Group = {
      ...groupData,
      id: Math.random().toString(36).substr(2, 9),
      participants: [],
      status: "created",
    };

    set((state) => ({
      groups: [...state.groups, newGroup],
      currentGroup: newGroup,
    }));

    return newGroup.id;
  },

  getGroup: (id) => {
    const group = get().groups.find((g) => g.id === id);
    set({ currentGroup: group || null });
  },

  addParticipant: async (groupId, participantData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    set((state) => {
      const groups = state.groups.map((g) => {
        if (g.id === groupId) {
          const newParticipant: Participant = {
            ...participantData,
            id: Math.random().toString(36).substr(2, 9),
            wishlist: [],
          };
          return { ...g, participants: [...g.participants, newParticipant] };
        }
        return g;
      });

      const currentGroup = groups.find((g) => g.id === groupId) || null;
      return { groups, currentGroup };
    });
  },

  removeParticipant: async (groupId, participantId) => {
    set((state) => {
      const groups = state.groups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            participants: g.participants.filter((p) => p.id !== participantId),
          };
        }
        return g;
      });

      const currentGroup = groups.find((g) => g.id === groupId) || null;
      return { groups, currentGroup };
    });
  },

  updateParticipant: async (groupId, participantId, data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          participants: g.participants.map((p) => {
            if (p.id !== participantId) return p;
            return { ...p, ...data };
          }),
        };
      }),
    }));
  },

  draw: async (groupId) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    set((state) => {
      const groups = state.groups.map((g) => {
        if (g.id === groupId) {
          // Simple shuffle and assign logic
          const participants = [...g.participants];
          let shuffled = [...participants];

          // Ensure no one draws themselves
          let valid = false;
          while (!valid) {
            shuffled = shuffled.sort(() => Math.random() - 0.5);
            valid = participants.every((p, i) => p.id !== shuffled[i].id);
          }

          const updatedParticipants = participants.map((p, i) => ({
            ...p,
            assignedToId: shuffled[i].id,
          }));

          return {
            ...g,
            participants: updatedParticipants,
            status: "drawn" as const,
          };
        }
        return g;
      });

      const currentGroup = groups.find((g) => g.id === groupId) || null;
      return { groups, currentGroup };
    });
  },
  deleteGroup: async (groupId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== groupId),
      currentGroup:
        state.currentGroup?.id === groupId ? null : state.currentGroup,
    }));
  },
}));
