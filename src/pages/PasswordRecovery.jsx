import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { forgotPassword, resetPassword } from '../services/api'
import { useAuth } from '../hooks/useAuth'

export default function PasswordRecovery({ reset = false }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [token] = useState(() => reset ? window.location.hash.slice(1) : '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const validLink = !reset || /^[a-f0-9]{64}$/.test(token)

  useEffect(() => {
    // Keep the reset secret in memory rather than the address bar or history.
    if (reset) navigate('/reset-password', { replace: true })
  }, [reset, navigate])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (reset && password !== confirmation) {
      setError('Your passwords do not match.')
      return
    }
    setBusy(true)
    try {
      const result = reset
        ? await resetPassword(token, password)
        : await forgotPassword(email.trim())
      if (reset) {
        logout()
        setPassword('')
        setConfirmation('')
      }
      setMessage(result.message)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='public-page auth-page'>
      <Navbar />
      <main className='auth-shell'>
        <section className='auth-card'>
          <div className='auth-intro'>
            <p className='landing-eyebrow'>Account recovery</p>
            <h1>{reset ? 'Choose a new password.' : 'Get back to your account.'}</h1>
            <p>{reset
              ? 'Your reset link expires after 30 minutes and can be used once. After resetting, sign in again on your devices.'
              : 'Enter the email address you used to register. We’ll send a link so you can choose a new password.'}</p>
            {!reset && <p>If you’ve forgotten your email address or cannot access that inbox, contact the Back 2 Owner team for help. Please don’t create a duplicate account.</p>}
          </div>
          <form className='auth-form' onSubmit={submit}>
            <div className='auth-form-heading'>
              <h2>{reset ? 'Reset password' : 'Forgot password?'}</h2>
            </div>
            {error && <p className='form-alert' role='alert'>{error}</p>}
            {message && <p className='auth-notice' role='status'>{message}</p>}
            {!validLink && <p className='form-alert' role='alert'>This reset link is missing or invalid. Request a new link to continue.</p>}
            {!message && validLink && <>
              {!reset ? <div className='form-row'>
                <label className='form-label' htmlFor='recovery-email'>Registered email address</label>
                <input id='recovery-email' type='email' className='form-input' value={email}
                  onChange={(e) => setEmail(e.target.value)} autoComplete='email' maxLength={254} required />
              </div> : <>
                <div className='form-row'>
                  <label className='form-label' htmlFor='new-password'>New password</label>
                  <div className='password-control'>
                    <input id='new-password' type={visible ? 'text' : 'password'} className='form-input'
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      autoComplete='new-password' minLength={8} maxLength={72} aria-describedby='password-help' required />
                    <button type='button' onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide passwords' : 'Show passwords'}>{visible ? 'Hide' : 'Show'}</button>
                  </div>
                  <p id='password-help'>Use at least 8 characters. A longer, unique passphrase is a good choice.</p>
                </div>
                <div className='form-row'>
                  <label className='form-label' htmlFor='confirm-password'>Confirm new password</label>
                  <input id='confirm-password' type={visible ? 'text' : 'password'} className='form-input'
                    value={confirmation} onChange={(e) => setConfirmation(e.target.value)} autoComplete='new-password'
                    minLength={8} maxLength={72} required />
                </div>
              </>}
              <button className='btn btn-block' type='submit' disabled={busy}>
                {busy ? (reset ? 'Resetting password…' : 'Requesting link…') : (reset ? 'Reset password' : 'Send reset link')}
              </button>
            </>}
            {reset && !message && <p className='auth-switch'><Link to='/forgot-password'>Request a new reset link</Link></p>}
            {!reset && message && <p>If the email does not arrive, check spam and confirm the address you registered with. Wait 5 minutes before requesting another link.</p>}
            <p className='auth-switch'><Link to='/login'>Back to sign in</Link></p>
          </form>
        </section>
      </main>
    </div>
  )
}
