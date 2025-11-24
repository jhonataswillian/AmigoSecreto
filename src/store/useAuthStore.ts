import { create } from "zustand";
import type { User, WishlistItem } from "../types";

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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  wishlist: [],

  login: async (email, password) => {
    // Mock login logic
    const foundUser = MOCK_USERS.find((u) => u.email === email);

    if (foundUser || (email === "admin@example.com" && password === "admin")) {
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

    set({
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: "Usuário Teste",
        email,
        handle: "@usuario",
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

    set({
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        handle,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
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
}));
