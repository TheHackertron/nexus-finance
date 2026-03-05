import api from "./axios"

export const getSummaryAPI = () => api.get("/analytics/summary")
export const getMonthlyTrendAPI = () => api.get("/analytics/monthly-trend")
export const getCategoryBreakdownAPI = (params) => api.get("/analytics/category-breakdown", { params })
export const getCashFlowAPI = () => api.get("/analytics/cash-flow")
export const getBudgetUsageAPI = (params) => api.get("/analytics/budget-usage", { params })
export const getInsightsAPI = () => api.get("/analytics/insights")
