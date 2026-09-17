import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getRoleHome } from '../utils/getRoleHome'

function PartnerOrAdminRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to='/login' replace />
  }

  if (!['partner', 'admin'].includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />
  }

  return children
}

export default PartnerOrAdminRoute
