import { Link } from 'react-router-dom'
import Logo from './Logo'
import { getRoleHome } from '../utils/getRoleHome'

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <nav className='nav'>
      <div className='nav-center'>
        <Logo />
        <div className='nav-links' aria-label='Primary navigation'>
          <Link to='/items'>Browse Items</Link>

          {!user && <Link to='/login' className='nav-login'>Login</Link>}

          {user && (
            <Link to={getRoleHome(user.role)} className='nav-login'>Dashboard</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
