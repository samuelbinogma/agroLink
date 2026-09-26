
import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

const TOKEN_KEY = 'agrolink_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  // `loading` prevents a flash of "logged out" UI while we fetch /me.
  const [loading, setLoading] = useState(Boolean(token))


  useEffect(() => {
    if (!token) return
    let cancelled = false
    api
      .get('/auth/me')
      .then(({ data }) => { if (!cancelled) setUser(data.user) })
      .catch(() => {
        // Interceptor already cleared the bad token.
        if (!cancelled) setUser(null)
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token])

  const persistLogin = ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token)
    setToken(token)
    setUser(user)
  }

  const login = async (contact, password) => {
    const { data } = await api.post('/auth/login', { contact, password })
    persistLogin(data)
    return data.user
  }

  /** Creates the account; backend auto-sends the OTP. Returns { via } info. */
  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    return data
  }

  const requestOtp = (contact) => api.post('/auth/request-otp', { contact })

  const verifyOtp = async (contact, otp) => {
    const { data } = await api.post('/auth/verify-otp', { contact, otp })
    persistLogin(data)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, requestOtp, verifyOtp, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}


// The hook every component uses to reach this context.
// Throwing an error here catches mis-use (useAuth outside the provider).
// oxlint wants one export per file for React Fast Refresh; keeping the hook
// beside its provider is a widely-used pattern, so we opt out of that rule.
// eslint-disable-next-line react/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}