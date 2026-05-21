import { Navigate } from 'react-router-dom'

function PartnerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'))

  if (!user || user.role !== 'partner') {
    return <Navigate to='/' />
  }

  return children
}

export default PartnerRoute
