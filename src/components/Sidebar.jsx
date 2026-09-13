import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Sidebar({ open = false, onNavigate }) {
  const { user } = useAuth()

  const isAdmin = user?.role === 'admin'
  const isPartner = user?.role === 'partner'

  return (
    <aside
      id='primary-sidebar'
      className={`sidebar${open ? ' sidebar-open' : ''}`}
      aria-label='Primary navigation'
    >
      <div className='sidebar-section'>
        <p className='sidebar-label'>Main</p>

        <NavLink to='/items' onClick={onNavigate}>Browse Items</NavLink>

        {user && <NavLink to='/notifications' onClick={onNavigate}>Notifications</NavLink>}

        {user && !isAdmin && !isPartner && (
          <NavLink to='/dashboard' onClick={onNavigate}>My Dashboard</NavLink>
        )}
        {user && <NavLink to='/profile' onClick={onNavigate}>Profile</NavLink>}
      </div>

      {isPartner && (
        <div className='sidebar-section'>
          <p className='sidebar-label'>Partner</p>

          <NavLink to='/partner' onClick={onNavigate}>Partner Dashboard</NavLink>
          <NavLink to='/add-item' onClick={onNavigate}>Upload Item</NavLink>
          <NavLink to='/claim-requests' onClick={onNavigate}>Claim Requests</NavLink>
          <NavLink to='/recovery-history' onClick={onNavigate}>Recovery History</NavLink>
          <NavLink to='/analytics/recovery' onClick={onNavigate}>Recovery Analytics</NavLink>
        </div>
      )}

      {isAdmin && (
        <div className='sidebar-section'>
          <p className='sidebar-label'>Admin</p>

          <NavLink to='/admin' end onClick={onNavigate}>Admin Dashboard</NavLink>
          <NavLink to='/admin/users' onClick={onNavigate}>User Management</NavLink>
          <NavLink to='/pending-items' onClick={onNavigate}>Pending Items</NavLink>
          <NavLink to='/admin/claims' onClick={onNavigate}>Pending Claims</NavLink>
          <NavLink to='/recovery-history' onClick={onNavigate}>Recovery History</NavLink>
          <NavLink to='/analytics/recovery' onClick={onNavigate}>Recovery Analytics</NavLink>
          <NavLink to='/analytics/branches' onClick={onNavigate}>Branch Performance</NavLink>
          <NavLink to='/admin/partners' onClick={onNavigate}>Partner Management</NavLink>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
