import { useState } from 'react'
import { loginUser } from '../services/api'
import { AuthContext } from './auth-context'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const login = async (formData) => {
    const data = await loginUser(formData)

    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)

    return data
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateSession = (updates) => {
    setUser((currentUser) => {
      const updatedUser = { ...currentUser, ...updates }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return updatedUser
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateSession }}>
      {children}
    </AuthContext.Provider>
  )
}
