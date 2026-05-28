import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Sidebar() {
  const { user } = useAuth()

  const isAdmin = user?.role === 'admin'
  const isPartner = user?.role === 'partner'

  return (
    <aside className='sidebar'>
      <Link to='/'>Home</Link>
      <Link to='/items'>Browse Items</Link>

      {user && <Link to='/dashboard'>Dashboard</Link>}
      {user && <Link to='/notifications'>Notifications</Link>}

      {isPartner && <Link to='/partner'>Partner Dashboard</Link>}
      {isPartner && <Link to='/add-item'>Upload Item</Link>}

      {isAdmin && <Link to='/pending-items'>Pending Items</Link>}
      {isAdmin && <Link to='/admin/claims'>Pending Claims</Link>}
    </aside>
  )
}

export default Sidebar
