import { create } from "zustand";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

// Mock notifications de exemplo
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Orçamento de Lazer",
    message: "Você atingiu 85% do seu limite de lazer este mês.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    type: "warning",
  },
  {
    id: "2",
    title: "Score atualizado",
    message: "Seu score de crédito subiu para 720 pontos. Continue assim!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    type: "success",
  },
  {
    id: "3",
    title: "Lembrete de conta",
    message: "O aluguel de R$ 1.000,00 vence em 3 dias.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    type: "info",
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: INITIAL_NOTIFICATIONS,
  unreadCount: INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,

  addNotification: (n) =>
    set((state) => {
      const newNotif: Notification = {
        ...n,
        id: String(Date.now()),
        timestamp: new Date(),
        read: false,
      };
      const updated = [newNotif, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: updated.filter((x) => !x.read).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  clearAll: () =>
    set({ notifications: [], unreadCount: 0 }),
}));
