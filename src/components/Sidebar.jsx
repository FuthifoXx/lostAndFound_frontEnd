import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Sidebar() {
  const { user } = useAuth()

  const isAdmin = user?.role === 'admin'
  const isPartner = user?.role === 'partner'

  return (
    <aside className='sidebar'>
      <div className='sidebar-section'>
        <p className='sidebar-label'>Main</p>

        <NavLink to='/items'>Browse Items</NavLink>

        {user && <NavLink to='/notifications'>Notifications</NavLink>}

        {user && !isAdmin && !isPartner && (
          <NavLink to='/dashboard'>My Dashboard</NavLink>
        )}
        {user && <NavLink to='/profile'>Profile</NavLink>}
      </div>

      {isPartner && (
        <div className='sidebar-section'>
          <p className='sidebar-label'>Partner</p>

          <NavLink to='/partner'>Partner Dashboard</NavLink>
          <NavLink to='/add-item'>Upload Item</NavLink>
          <NavLink to='/claim-requests'>Claim Requests</NavLink>
          <NavLink to='/recovery-history'>Recovery History</NavLink>
          <NavLink to='/analytics/recovery'>Recovery Analytics</NavLink>
        </div>
      )}

      {isAdmin && (
        <div className='sidebar-section'>
          <p className='sidebar-label'>Admin</p>

          <NavLink to='/admin'>Admin Dashboard</NavLink>
          <NavLink to='/admin/users'>User Management</NavLink>
          <NavLink to='/pending-items'>Pending Items</NavLink>
          <NavLink to='/admin/claims'>Pending Claims</NavLink>
          <NavLink to='/recovery-history'>Recovery History</NavLink>
          <NavLink to='/analytics/recovery'>Recovery Analytics</NavLink>
          <NavLink to='/analytics/branches'>Branch Performance</NavLink>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
