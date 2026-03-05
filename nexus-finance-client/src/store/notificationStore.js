import { create } from "zustand"
import api from "../api/axios"

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const res = await api.get("/notifications")
      if (res.data.success) {
        const notifs = res.data.data
        set({
          notifications: notifs,
          unreadCount: notifs.filter((n) => !n.isRead).length,
        })
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    }
  },

  markRead: async (id) => {
    try {
      await api.put(`/notifications/${id}`)
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }))
    } catch (err) {
      console.error("Failed to mark notification read:", err)
    }
  },

  markAllRead: async () => {
    try {
      await api.put("/notifications/read-all")
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }))
    } catch (err) {
      console.error("Failed to mark all read:", err)
    }
  },
}))
