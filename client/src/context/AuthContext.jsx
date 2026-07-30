import React, { createContext, useContext, useState } from 'react'
import AuthService from '../services/AuthService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    return token ? { token } : null
  })

  async function login(credentials) {
    const data = await AuthService.login(credentials)
    if (data.token) {
      localStorage.setItem('token', data.token)
      setUser({ token: data.token })
    }
    return data
  }

  async function register(credentials) {
    const data = await AuthService.register(credentials)
    if (data.token) {
      localStorage.setItem('token', data.token)
      setUser({ token: data.token })
    }
    return data
  }

  function logout() {
    AuthService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
