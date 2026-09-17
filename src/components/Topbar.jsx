import Logo from './Logo'
import { useAuth } from '../hooks/useAuth'

function Topbar({ sidebarOpen, onMenuClick }) {
  const { user, logout } = useAuth()

  return (
    <header className='topbar'>
      <div className='topbar-brand'>
        <button
          type='button'
          className='menu-toggle'
          aria-label='Toggle navigation menu'
          aria-controls='primary-sidebar'
          aria-expanded={sidebarOpen}
          onClick={onMenuClick}
        >
          <span aria-hidden='true'>☰</span>
        </button>

        <Logo />
      </div>

      <div className='topbar-user'>
        {user && (
          <>
            <span className='role-badge'>{user.role}</span>
            <span className='topbar-email' title={user.email}>
              {user.email}
            </span>
            <button className='btn btn-hipster' onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Topbar
