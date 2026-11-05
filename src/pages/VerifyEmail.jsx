import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { confirmEmail } from '../services/api'
export default function VerifyEmail() {
  const navigate = useNavigate()
  const [token] = useState(() => window.location.hash.slice(1))
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('')
  useEffect(() => {
    navigate('/verify-email', { replace: true })
  }, [navigate])
  const valid = /^[a-f0-9]{64}$/.test(token)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await confirmEmail(token)
      setMessage(result.message)
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
            <p className="landing-eyebrow">Confirm your inbox</p>
            <h1>You choose what comes next.</h1>
            <p>
              Email confirmation shows you can access this inbox. It does not
              verify your identity or ownership of a document.
            </p>
          </div>
          <form className="auth-form" onSubmit={submit}>
            <h2>Confirm email</h2>
            {message ? (
              <p className="auth-notice" role="status">
                {message}
              </p>
            ) : !valid ? (
              <p className="form-alert" role="alert">
                This confirmation link is missing or invalid. Request a new one
                from Recovery setup.
              </p>
            ) : (
              <>
                <p>
                  Confirm your email to enable private recovery matching when
                  you are ready.
                </p>
                <button className="btn btn-block" disabled={busy}>
                  {busy ? 'Confirming…' : 'Confirm my email'}
                </button>
              </>
            )}
            {error && (
              <p className="form-alert" role="alert">
                {error}
              </p>
            )}
            <p className="auth-switch">
              <Link to="/recovery-setup">Open Recovery setup</Link>
            </p>
            <p className="auth-switch">
              <Link to="/login?returnTo=%2Frecovery-setup">Sign in</Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}
