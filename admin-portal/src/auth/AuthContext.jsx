import { createContext, useContext, useState } from 'react'
import { login as apiLogin } from '../api/adminApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Treat the presence of a token as "logged in".
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  async function login(username, password) {
    const { token } = await apiLogin(username, password)
    localStorage.setItem('token', token)
    setToken(token)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, isAuthed: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
