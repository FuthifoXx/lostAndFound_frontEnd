import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getRoleHome } from '../utils/getRoleHome'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedReturnTo = searchParams.get('returnTo')
  const returnTo =
    requestedReturnTo?.startsWith('/') &&
    !requestedReturnTo.startsWith('//')
      ? requestedReturnTo
      : ''

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      setError('')
      const authenticatedUser = await login(form)
      const destination =
        authenticatedUser.role === 'user' && returnTo
          ? returnTo
          : getRoleHome(authenticatedUser.role)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message)
      setForm((currentForm) => ({ ...currentForm, password: '' }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='public-page auth-page'>
      <Navbar />

      <main className='auth-shell'>
        <section className='auth-card'>
          <div className='auth-intro'>
            <p className='landing-eyebrow'>Welcome back</p>
            <h1>Your path back to what matters.</h1>
            <p>
              Sign in to review matches, manage claims, follow recovery progress,
              and receive updates from verified collection partners.
            </p>
            <ul className='auth-benefits'>
              <li>Protected identity matching</li>
              <li>Secure claim tracking</li>
              <li>Verified collection history</li>
            </ul>
          </div>

          <form className='auth-form' onSubmit={handleSubmit}>
            <div className='auth-form-heading'>
              <h2>Sign in</h2>
              <p>Enter your Back 2 Owner account details.</p>
            </div>

            {returnTo && (
              <p className='auth-notice'>Sign in to continue with this item.</p>
            )}

            {error && <p className='form-alert' role='alert'>{error}</p>}

            <div className='form-row'>
              <label className='form-label' htmlFor='login-email'>Email address</label>
              <input
                id='login-email'
                type='email'
                name='email'
                className='form-input'
                placeholder='you@example.com'
                value={form.email}
                onChange={handleChange}
                autoComplete='email'
                autoFocus
                required
              />
            </div>

            <div className='form-row'>
              <label className='form-label' htmlFor='login-password'>Password</label>
              <div className='password-control'>
                <input
                  id='login-password'
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  className='form-input'
                  value={form.password}
                  onChange={handleChange}
                  autoComplete='current-password'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type='submit' className='btn btn-block' disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            <p className='auth-switch'>
              New to Back 2 Owner?{' '}
              <Link
                to={returnTo ? `/register?returnTo=${encodeURIComponent(returnTo)}` : '/register'}
              >
                Create an account
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Login
