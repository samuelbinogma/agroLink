/**
 * client.js — a single, reusable Axios instance.
 *
 * The request INTERCEPTOR is why we built a shared client:
 * it reads the saved JWT from localStorage ONCE and attaches it to every
 * outgoing request. Individual pages never touch tokens.
 *
 * On 401 responses we drop the stale token so a logged-out UI can't
 * keep firing authenticated calls (the AuthContext listens for logout).
 */
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ---- Attach token to every request (if we have one) ----
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrolink_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---- React to 401s: token is gone/expired -> clear it ----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('agrolink_token')
    }
    return Promise.reject(error)
  }
)

export default api