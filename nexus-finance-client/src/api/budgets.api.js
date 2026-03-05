import api from "./axios"

export const getBudgetsAPI = (params) => api.get("/budgets", { params })
export const createBudgetAPI = (data) => api.post("/budgets", data)
export const updateBudgetAPI = (id, data) => api.put(`/budgets/${id}`, data)
export const deleteBudgetAPI = (id) => api.delete(`/budgets/${id}`)
