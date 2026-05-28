import { Link } from 'react-router-dom'
import Logo from './Logo'

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'))

  const isAdmin = user?.role === 'admin'
  const isPartner = user?.role === 'partner'

  return (
    <nav className='nav'>
      <div className='nav-center'>
        <Logo />
        <div className='nav-links'>
          <Link to='/'>Home</Link>
          <Link to='/items'>Browse Items</Link>

          {!user && <Link to='/login'>Login</Link>}

          {user && <Link to='/dashboard'>Dashboard</Link>}

          {user && <Link to='/notifications'>Notifications</Link>}

          {isPartner && <Link to='/partner'>Partner Dashboard</Link>}

          {isPartner && <Link to='/add-item'>Upload Item</Link>}

          {isAdmin && <Link to='/pending-items'>Pending Items</Link>}

          {isAdmin && <Link to='/admin/claims'>Pending Claims</Link>}
        </div>
      </div>
    </nav>
  )
}

export default Navbar