import api from "./axios"

export const getTransactionsAPI = (params) => api.get("/transactions", { params })
export const createTransactionAPI = (data) => api.post("/transactions", data)
export const updateTransactionAPI = (id, data) => api.put(`/transactions/${id}`, data)
export const deleteTransactionAPI = (id) => api.delete(`/transactions/${id}`)
export const bulkDeleteTransactionsAPI = (ids) => api.delete("/transactions/bulk", { data: { ids } })
export const exportCSVAPI = () => api.get("/transactions/export/csv", { responseType: "blob" })
