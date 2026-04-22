import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

function Landing() {
  return (
    <>
      <Navbar />

      <section className='form'>
        <h2>Welcome to Back2Owner</h2>
        <p className='text'>
          Helping lost items find their way back to their rightful owners.
        </p>

        <Link to='/login' className='btn'>
          Login
        </Link>
        <Link
          to='/register'
          className='btn btn-hipster'
          style={{ marginLeft: '1rem' }}
        >
          Register
        </Link>
      </section>
    </>
  )
}

export default Landing
