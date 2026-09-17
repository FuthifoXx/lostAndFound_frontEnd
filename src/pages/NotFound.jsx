import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../hooks/useAuth'
import { getRoleHome } from '../utils/getRoleHome'

function NotFound() {
  const { user } = useAuth()
  const destination = user ? getRoleHome(user.role) : '/'

  return (
    <main className='not-found-page'>
      <Logo />
      <section className='not-found-card'>
        <p className='dashboard-section-eyebrow'>404 error</p>
        <h1>Page not found</h1>
        <p>The page may have moved, or the address may be incorrect.</p>
        <Link className='btn' to={destination}>{user ? 'Return to dashboard' : 'Return home'}</Link>
      </section>
    </main>
  )
}

export default NotFound
