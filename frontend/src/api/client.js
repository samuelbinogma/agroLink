/**
 * client.js — a single, reusable Axios instance.
 *
 * Why a shared instance instead of calling axios.get(...) everywhere?
 *   1. baseURL('/api') + the Vite proxy (vite.config.js) means we write
 *      `api.get('/health')` and never hardcode http://localhost:5000.
 *   2. Later (Feature 2 JWT auth) we add ONE interceptor here that attaches
 *      the token to every request — no changes needed in individual pages.
 */
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api