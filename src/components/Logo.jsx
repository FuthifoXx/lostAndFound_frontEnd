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
      Back <span className='logo-accent'>2</span> Owner
    </Link>
  )
}

export default Logo
