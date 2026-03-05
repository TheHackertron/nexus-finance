import api from "./axios"

export const getGoalsAPI = () => api.get("/goals")
export const getGoalAPI = (id) => api.get(`/goals/${id}`)
export const createGoalAPI = (data) => api.post("/goals", data)
export const updateGoalAPI = (id, data) => api.put(`/goals/${id}`, data)
export const deleteGoalAPI = (id) => api.delete(`/goals/${id}`)
export const addContributionAPI = (id, data) => api.post(`/goals/${id}/contribute`, data)
