import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getRoleHome } from '../utils/getRoleHome'

function Logo() {
  const { user } = useAuth()

  return (
    <Link
      className='logo'
      to={user ? getRoleHome(user.role) : '/'}
      aria-label='Back 2 Owner home'
    >
      <img className='logo-image' src='/back-2-owner-logo.png' alt='Back 2 Owner' width='1448' height='1086' />
    </Link>
  )
}

export default Logo
