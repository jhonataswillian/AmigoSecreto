import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface Notification {
  id: string;
  user_id: string;
  type: "invite" | "info" | "success" | "warning";
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  subscribeToNotifications: () => void;
  unsubscribeFromNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    set({
      notifications: data as Notification[],
      unreadCount: data.filter((n) => !n.read).length,
      isLoading: false,
    });
  },

  markAsRead: async (id) => {
    // Optimistic update
    set((state) => {
      const newNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      };
    });

    await supabase.from("notifications").update({ read: true }).eq("id", id);
  },

  markAllAsRead: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id);
  },

  removeNotification: async (id) => {
    set((state) => {
      const newNotifications = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      };
    });

    await supabase.from("notifications").delete().eq("id", id);
  },

  addNotification: (
    notification: Omit<Notification, "id" | "user_id" | "read" | "created_at">,
  ) => {
    set((state) => ({
      notifications: [
        {
          id: Math.random().toString(36).substr(2, 9),
          user_id: "local",
          read: false,
          created_at: new Date().toISOString(),
          ...notification,
        },
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + 1,
    }));
  },

  subscribeToNotifications: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
          }));
        },
      )
      .subscribe();

    // Store channel cleanup if needed, but for global store it's usually fine
  },

  unsubscribeFromNotifications: () => {
    supabase.channel("notifications").unsubscribe();
  },
}));
