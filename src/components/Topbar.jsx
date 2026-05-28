import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header className='topbar'>
      <Logo />

      <div className='topbar-user'>
        {user && (
          <>
            <span>{user.role}</span>
            <span>{user.email}</span>
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
