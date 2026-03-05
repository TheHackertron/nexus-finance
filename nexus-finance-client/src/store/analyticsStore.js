import { create } from "zustand"
import {
  getSummaryAPI,
  getMonthlyTrendAPI,
  getCategoryBreakdownAPI,
  getCashFlowAPI,
  getBudgetUsageAPI,
  getInsightsAPI,
} from "../api/analytics.api"

export const useAnalyticsStore = create((set) => ({
  summary: null,
  monthlyTrend: [],
  categoryBreakdown: [],
  cashFlow: [],
  budgetUsage: [],
  insights: [],
  loading: false,

  fetchSummary: async () => {
    try {
      const res = await getSummaryAPI()
      if (res.data.success) set({ summary: res.data.data })
    } catch (err) {
      console.error("Failed to fetch summary:", err)
    }
  },

  fetchMonthlyTrend: async () => {
    try {
      const res = await getMonthlyTrendAPI()
      if (res.data.success) set({ monthlyTrend: res.data.data })
    } catch (err) {
      console.error("Failed to fetch monthly trend:", err)
    }
  },

  fetchCategoryBreakdown: async (params) => {
    try {
      const res = await getCategoryBreakdownAPI(params)
      if (res.data.success) set({ categoryBreakdown: res.data.data })
    } catch (err) {
      console.error("Failed to fetch category breakdown:", err)
    }
  },

  fetchCashFlow: async () => {
    try {
      const res = await getCashFlowAPI()
      if (res.data.success) set({ cashFlow: res.data.data })
    } catch (err) {
      console.error("Failed to fetch cash flow:", err)
    }
  },

  fetchBudgetUsage: async (params) => {
    try {
      const res = await getBudgetUsageAPI(params)
      if (res.data.success) set({ budgetUsage: res.data.data })
    } catch (err) {
      console.error("Failed to fetch budget usage:", err)
    }
  },

  fetchInsights: async () => {
    try {
      const res = await getInsightsAPI()
      if (res.data.success) set({ insights: res.data.data })
    } catch (err) {
      console.error("Failed to fetch insights:", err)
    }
  },

  fetchAll: async () => {
    set({ loading: true })
    try {
      const [summary, trend, category, cashFlow, budget, insights] = await Promise.all([
        getSummaryAPI(),
        getMonthlyTrendAPI(),
        getCategoryBreakdownAPI(),
        getCashFlowAPI(),
        getBudgetUsageAPI(),
        getInsightsAPI(),
      ])
      set({
        summary: summary.data.success ? summary.data.data : null,
        monthlyTrend: trend.data.success ? trend.data.data : [],
        categoryBreakdown: category.data.success ? category.data.data : [],
        cashFlow: cashFlow.data.success ? cashFlow.data.data : [],
        budgetUsage: budget.data.success ? budget.data.data : [],
        insights: insights.data.success ? insights.data.data : [],
      })
    } catch (err) {
      console.error("Failed to fetch analytics:", err)
    } finally {
      set({ loading: false })
    }
  },
}))
