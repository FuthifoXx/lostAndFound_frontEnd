import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getRoleHome } from '../utils/getRoleHome'

function UserRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to='/login' replace />
  }

  if (user.role !== 'user') {
    return <Navigate to={getRoleHome(user.role)} replace />
  }

  return children
}

export default UserRoute
