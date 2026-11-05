import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { registerUser } from '../services/api'
import Navbar from '../components/Navbar'

export default function Register() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const requested = params.get('returnTo')
  const returnTo =
    requested?.startsWith('/') && !requested.startsWith('//')
      ? requested
      : '/recovery-setup'
  const loginPath = `/login?returnTo=${encodeURIComponent(returnTo)}&registered=1`
  const [form, setForm] = useState({ displayName: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await registerUser(form)
      navigate(loginPath, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="public-page auth-page">
      <Navbar />
      <main className="auth-shell">
        <section className="auth-card">
          <div className="auth-intro">
            <p className="landing-eyebrow">Start with the basics</p>
            <h1>Your recovery journey starts here.</h1>
            <p>
              Create an account with a display name, email and password. Your ID
              number, date of birth and document names are not needed to join.
            </p>
            <ul className="auth-benefits">
              <li>Keep a private lost-item report</li>
              <li>Choose matching options when you are ready</li>
              <li>Track claims and collection updates</li>
            </ul>
            <p>
              Creating an account does not enable document matching
              automatically. You can set that up later with a clear explanation
              of the details needed.
            </p>
          </div>
          <form className="auth-form" onSubmit={submit}>
            <div className="auth-form-heading">
              <h2>Create account</h2>
              <p>Join first. Add recovery details when you choose.</p>
            </div>
            {error && (
              <p className="form-alert" role="alert">
                {error}
              </p>
            )}
            <div className="form-row">
              <label className="form-label" htmlFor="display-name">
                Display name
              </label>
              <input
                id="display-name"
                name="displayName"
                className="form-input"
                value={form.displayName}
                onChange={change}
                autoComplete="nickname"
                maxLength={80}
                required
              />
              <small>
                A name you would like us to use. It does not have to match your
                ID.
              </small>
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="register-email">
                Email address
              </label>
              <input
                id="register-email"
                type="email"
                name="email"
                className="form-input"
                value={form.email}
                onChange={change}
                autoComplete="email"
                maxLength={254}
                required
              />
              <small>We’ll send a confirmation link to this address.</small>
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="register-password">
                Password
              </label>
              <div className="password-control">
                <input
                  id="register-password"
                  type={visible ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  value={form.password}
                  onChange={change}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  required
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  aria-label={visible ? 'Hide password' : 'Show password'}
                >
                  {visible ? 'Hide' : 'Show'}
                </button>
              </div>
              <small>Use at least 8 characters and a unique passphrase.</small>
            </div>
            <button type="submit" className="btn btn-block" disabled={busy}>
              {busy ? 'Creating account…' : 'Create account'}
            </button>
            <p className="auth-switch">
              Already registered? <Link to={loginPath}>Sign in</Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}
