import { create } from "zustand"

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user")
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    set({ user: null, token: null })
  },

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user))
    set({ user })
  },
}))
