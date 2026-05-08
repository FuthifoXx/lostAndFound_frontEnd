import { Link } from 'react-router-dom'
import Logo from './Logo'

function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-center">
        <Logo />
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/add-item">Add Item</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar