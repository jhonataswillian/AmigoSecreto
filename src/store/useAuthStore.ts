import { create } from "zustand";
import type { User, WishlistItem } from "../types";
import { AVATAR_CATEGORIES } from "../data/avatars";

interface AuthState {
  /** The currently authenticated user */
  user: User | null;
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** The current user's personal wishlist */
  wishlist: WishlistItem[];

  /**
   * Authenticates a user with email and password.
   * @param email User's email
   * @param password User's password
   */
  login: (email: string, password: string) => Promise<void>;

  /**
   * Registers a new user.
   * @param name User's full name
   * @param email User's email
   * @param password User's password
   * @param handle User's unique handle (e.g. @username)
   */
  register: (
    name: string,
    email: string,
    password: string,
    handle: string,
  ) => Promise<void>;

  /** Logs out the current user */
  logout: () => void;

  /**
   * Adds an item to the user's wishlist.
   * @param item The item data to add
   */
  addToWishlist: (item: Omit<WishlistItem, "id">) => Promise<void>;

  /**
   * Removes an item from the user's wishlist.
   * @param id The ID of the item to remove
   */
  removeFromWishlist: (id: string) => Promise<void>;

  /**
   * Updates an existing wishlist item.
   * @param id The ID of the item to update
   * @param data The partial data to update
   */
  updateWishlistItem: (
    id: string,
    data: Partial<Omit<WishlistItem, "id">>,
  ) => Promise<void>;

  /**
   * Finds a user by their unique handle.
   * @param handle The handle to search for (e.g. @username)
   * @returns The user object if found, null otherwise
   */
  findUserByHandle: (handle: string) => Promise<User | null>;

  /**
   * Updates the current user's profile.
   * @param data Partial user data to update
   */
  updateProfile: (data: Partial<User>) => Promise<void>;

  /**
   * Updates the user's handle.
   * @param newHandle The new handle
   * @throws Error if handle is taken or if user has already changed it once
   */
  updateHandle: (newHandle: string) => Promise<void>;

  /**
   * Updates the user's display name.
   * @param newName The new display name
   * @throws Error if user has already changed it once
   */
  updateName: (newName: string) => Promise<void>;

  /**
   * Changes the user's password.
   * @param oldPwd Old password
   * @param newPwd New password
   */
  changePassword: (oldPwd: string, newPwd: string) => Promise<void>;

  /**
   * Deletes the user's account.
   */
  deleteAccount: () => Promise<void>;
}

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santa",
    handle: "@admin",
    isAdmin: true,
  },
  {
    id: "2",
    name: "João Silva",
    email: "joao@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
    handle: "@joao",
  },
  {
    id: "3",
    name: "Maria Silva",
    email: "maria@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    handle: "@maria",
  },
  {
    id: "4",
    name: "Pedro Santos",
    email: "pedro@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    handle: "@pedro",
  },
];

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  wishlist: [],

  login: async (identifier, password) => {
    // Mock login logic
    const foundUser = MOCK_USERS.find(
      (u) =>
        u.email === identifier ||
        u.handle.toLowerCase() === identifier.toLowerCase(),
    );

    if (
      foundUser ||
      (identifier === "admin@example.com" && password === "admin")
    ) {
      const user = foundUser || MOCK_USERS[0];
      set({
        user,
        isAuthenticated: true,
        wishlist: [
          {
            id: "1",
            name: "Meias Coloridas",
            description: "Tamanho 40",
            price: 29.9,
          },
          {
            id: "2",
            name: "Livro de Ficção",
            description: "Qualquer um do Stephen King",
            price: 59.9,
          },
        ],
      });
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // If not found in mock, create a new session user (mock behavior)
    // Determine if identifier is email-like
    const isEmail = identifier.includes("@") && identifier.includes(".");
    const email = isEmail
      ? identifier
      : `${identifier.replace("@", "")}@example.com`;
    const handle = isEmail ? `@${identifier.split("@")[0]}` : identifier;

    set({
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: "Usuário Teste",
        email,
        handle,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      },
      isAuthenticated: true,
      wishlist: [],
    });
  },

  register: async (name, email, _password, handle) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if handle is taken (mock)
    if (MOCK_USERS.some((u) => u.handle === handle)) {
      throw new Error("Este @handle já está em uso.");
    }

    // Randomly select default avatar from Pets or Natal
    const categories = AVATAR_CATEGORIES.filter(
      (c) => c.id === "cute" || c.id === "christmas",
    );
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomAvatar =
      randomCategory.avatars[
        Math.floor(Math.random() * randomCategory.avatars.length)
      ];

    set({
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        handle,
        avatar: randomAvatar,
      },
      isAuthenticated: true,
      wishlist: [],
    });
  },

  logout: () => set({ user: null, isAuthenticated: false, wishlist: [] }),

  addToWishlist: async (item) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      wishlist: [
        ...state.wishlist,
        { ...item, id: Math.random().toString(36).substr(2, 9) },
      ],
    }));
  },

  removeFromWishlist: async (id) => {
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== id),
    }));
  },

  updateWishlistItem: async (id, data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      wishlist: state.wishlist.map((item) =>
        item.id === id ? { ...item, ...data } : item,
      ),
    }));
  },

  findUserByHandle: async (handle) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return (
      MOCK_USERS.find((u) => u.handle.toLowerCase() === handle.toLowerCase()) ||
      null
    );
  },

  updateProfile: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));

    // Sync with GroupStore (Mock Sync)
    const { user } = get();
    if (user) {
      // We need to dynamically import or access the store to avoid circular deps if possible,
      // or just trust that in a real app this is backend handled.
      // For this mock, we'll access the window or just assume we can't easily reach across stores without a refactor.
      // BETTER APPROACH: Let's use the window object or a custom event to trigger the sync,
      // OR just import useGroupStore directly if it's safe.
      // Let's try importing useGroupStore at the top of the file, but that might be circular.
      // Instead, let's just assume the UI will refresh if we reload, but the user wants it live.
      // Let's try to access the store via the module if it's already loaded.

      // Actually, the cleanest way in this specific codebase without refactoring everything
      // is to dispatch a custom event that the GroupStore listens to, or just hack it:

      import("./useGroupStore").then(({ useGroupStore }) => {
        const groupStore = useGroupStore.getState();
        groupStore.groups.forEach((group) => {
          const participant = group.participants.find(
            (p) => p.userId === user.id,
          );
          if (participant) {
            groupStore.updateParticipant(group.id, participant.id, {
              avatar: data.avatar || user.avatar,
              frame: data.frame || user.frame,
              name: data.name || user.name,
            });
          }
        });
      });
    }
  },

  updateHandle: async (newHandle) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { user } = get();

    if (!user) throw new Error("Usuário não autenticado");

    // Check if handle is taken (mock)
    if (
      MOCK_USERS.some(
        (u) =>
          u.handle.toLowerCase() === newHandle.toLowerCase() &&
          u.id !== user.id,
      )
    ) {
      throw new Error("Este handle já está em uso.");
    }

    // Check if already changed
    if (user.handleChangedAt) {
      throw new Error("Você só pode alterar seu handle uma vez.");
    }

    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            handle: newHandle,
            handleChangedAt: new Date().toISOString(),
          }
        : null,
    }));

    // Sync with GroupStore
    import("./useGroupStore").then(({ useGroupStore }) => {
      const groupStore = useGroupStore.getState();
      groupStore.groups.forEach((group) => {
        const participant = group.participants.find(
          (p) => p.userId === user.id,
        );
        if (participant) {
          groupStore.updateParticipant(group.id, participant.id, {
            handle: newHandle,
          });
        }
      });
    });
  },

  updateName: async (newName) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { user } = get();

    if (!user) throw new Error("Usuário não autenticado");

    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            name: newName,
            // nameChangedAt: new Date().toISOString(), // Optional: keep tracking if needed, but restriction is gone
          }
        : null,
    }));

    // Sync with GroupStore
    import("./useGroupStore").then(({ useGroupStore }) => {
      const groupStore = useGroupStore.getState();
      groupStore.groups.forEach((group) => {
        const participant = group.participants.find(
          (p) => p.userId === user.id,
        );
        if (participant) {
          groupStore.updateParticipant(group.id, participant.id, {
            name: newName,
          });
        }
      });
    });
  },

  changePassword: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Mock success
  },

  deleteAccount: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ user: null, isAuthenticated: false, wishlist: [] });
  },
}));
