import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const clearAuthAndRedirect = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  window.location.href = "/login"
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        if (res.data.success && res.data.data?.accessToken) {
          const newToken = res.data.data.accessToken
          localStorage.setItem("token", newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      } catch {
        // refresh request itself failed (network error, server down)
      }

      clearAuthAndRedirect()
      return new Promise(() => {})
    }

    return Promise.reject(error)
  }
)

export default api
