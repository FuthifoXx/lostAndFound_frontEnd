import { Navigate } from 'react-router-dom'

function PartnerOrAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'))

  if (!user || !['partner', 'admin'].includes(user.role)) {
    return <Navigate to='/' replace />
  }

  return children
}

export default PartnerOrAdminRoute
