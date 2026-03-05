import api from "./axios"

export const loginAPI = (data) => api.post("/auth/login", data)
export const registerAPI = (data) => api.post("/auth/register", data)
export const logoutAPI = () => api.post("/auth/logout")
export const refreshAPI = () => api.post("/auth/refresh")
export const onboardAPI = (data) => api.post("/auth/onboard", data)
export const getProfileAPI = () => api.get("/auth/profile")
export const updateProfileAPI = (data) => api.put("/auth/profile", data)
