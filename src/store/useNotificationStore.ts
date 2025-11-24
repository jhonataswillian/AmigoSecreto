import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'invite' | 'info' | 'success';
  title: string;
  message: string;
  read: boolean;
  date: string;
  actionLabel?: string;
  actionLink?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'date'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: '1',
      type: 'invite',
      title: 'Convite para Grupo',
      message: 'Você foi convidado para o "Amigo Secreto da Firma"!',
      read: false,
      date: new Date().toISOString(),
      actionLabel: 'Ver Grupo',
      actionLink: '/groups/1',
    },
    {
      id: '2',
      type: 'info',
      title: 'Sorteio Realizado!',
      message: 'O sorteio do grupo "Família Silva" já aconteceu. Venha ver quem você tirou!',
      read: false,
      date: new Date(Date.now() - 86400000).toISOString(),
      actionLabel: 'Ver Resultado',
      actionLink: '/groups/2/reveal',
    }
  ],
  unreadCount: 2,

  addNotification: (data) =>
    set((state) => {
      const newNotification: Notification = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        read: false,
        date: new Date().toISOString(),
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const newNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => {
      const newNotifications = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      };
    }),
}));
