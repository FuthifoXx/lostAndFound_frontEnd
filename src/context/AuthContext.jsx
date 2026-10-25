import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { AuthContext } from './auth-context'

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  useEffect(() => {
    const endSession = () => {
      setUser(null)
      const returnTo = `${location.pathname}${location.search}${location.hash}`
      const params = new URLSearchParams({ reason: 'session-ended' })
      if (!['/login', '/register'].includes(location.pathname)) {
        params.set('returnTo', returnTo)
      }
      navigate(`/login?${params}`, { replace: true })
    }
    window.addEventListener('auth:session-ended', endSession)
    return () => window.removeEventListener('auth:session-ended', endSession)
  }, [navigate, location.pathname, location.search, location.hash])

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
