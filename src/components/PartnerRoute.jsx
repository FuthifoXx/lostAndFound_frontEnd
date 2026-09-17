import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getRoleHome } from '../utils/getRoleHome'

function PartnerRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to='/login' replace />
  }

  if (user.role !== 'partner') {
    return <Navigate to={getRoleHome(user.role)} replace />
  }

  return children
}

export default PartnerRoute
