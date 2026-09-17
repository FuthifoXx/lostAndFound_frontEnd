import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { registerUser } from '../services/api'
import Navbar from '../components/Navbar'

function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedReturnTo = searchParams.get('returnTo')
  const returnTo =
    requestedReturnTo?.startsWith('/') &&
    !requestedReturnTo.startsWith('//')
      ? requestedReturnTo
      : ''
  const loginPath = returnTo
    ? `/login?returnTo=${encodeURIComponent(returnTo)}`
    : '/login'

  const [form, setForm] = useState({
    identityType: 'RSA_ID',
    idNumber: '',
    passportNumber: '',
    documentNumber: '',
    surname: '',
    initials: '',
    firstNames: '',
    phone: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
      setSuccess('')
      await registerUser(form)
      setSuccess('Account created. Taking you to sign in…')

      window.setTimeout(() => navigate(loginPath), 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const identityField = {
    RSA_ID: {
      label: 'RSA ID number',
      name: 'idNumber',
      placeholder: 'e.g. 13-digit RSA ID number',
      inputMode: 'numeric',
    },
    PASSPORT: {
      label: 'Passport number',
      name: 'passportNumber',
      placeholder: 'Enter passport number',
    },
    OTHER: {
      label: 'Document number',
      name: 'documentNumber',
      placeholder: 'Enter document number',
    },
  }[form.identityType]

  return (
    <div className='public-page auth-page registration-page'>
      <Navbar />

      <main className='registration-shell'>
        <section className='registration-card'>
          <header className='registration-heading'>
            <div>
              <p className='landing-eyebrow'>Create your secure profile</p>
              <h1>Let your lost item find you.</h1>
            </div>
            <p>
              Your identity details help Back 2 Owner privately match approved
              lost property to you. They are not shown in public listings.
            </p>
          </header>

          <form className='registration-form' onSubmit={handleSubmit}>
            {returnTo && (
              <p className='auth-notice'>Create an account to continue with this item.</p>
            )}
            {error && <p className='form-alert' role='alert'>{error}</p>}
            {success && <p className='alert alert-success' role='status'>{success}</p>}

            <fieldset className='registration-section'>
              <legend><span>1</span> Identity document</legend>
              <p className='registration-help'>Choose the document used for private matching.</p>

              <div className='registration-grid'>
                <div className='form-row'>
                  <label className='form-label' htmlFor='identity-type'>Identity type</label>
                  <select id='identity-type' name='identityType' className='form-input' value={form.identityType} onChange={handleChange}>
                    <option value='RSA_ID'>RSA ID</option>
                    <option value='PASSPORT'>Passport</option>
                    <option value='OTHER'>Other document</option>
                  </select>
                </div>

                <div className='form-row'>
                  <label className='form-label' htmlFor='identity-number'>{identityField.label}</label>
                  <input
                    id='identity-number'
                    type='text'
                    name={identityField.name}
                    className='form-input'
                    value={form[identityField.name]}
                    onChange={handleChange}
                    placeholder={identityField.placeholder}
                    inputMode={identityField.inputMode}
                    required
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className='registration-section'>
              <legend><span>2</span> Personal details</legend>
              <p className='registration-help'>Enter your names as they appear on your identity document.</p>

              <div className='registration-grid registration-grid-three'>
                <div className='form-row'>
                  <label className='form-label' htmlFor='first-names'>First names</label>
                  <input id='first-names' type='text' name='firstNames' className='form-input' value={form.firstNames} onChange={handleChange} placeholder='e.g. first names' autoComplete='given-name' required />
                </div>
                <div className='form-row'>
                  <label className='form-label' htmlFor='surname'>Surname</label>
                  <input id='surname' type='text' name='surname' className='form-input' value={form.surname} onChange={handleChange} placeholder='e.g. surname' autoComplete='family-name' required />
                </div>
                <div className='form-row'>
                  <label className='form-label' htmlFor='initials'>Initials</label>
                  <input id='initials' type='text' name='initials' className='form-input' value={form.initials} onChange={handleChange} placeholder='Enter initials' required />
                </div>
              </div>
            </fieldset>

            <fieldset className='registration-section'>
              <legend><span>3</span> Contact and security</legend>
              <p className='registration-help'>Used for secure account access and recovery updates.</p>

              <div className='registration-grid'>
                <div className='form-row'>
                  <label className='form-label' htmlFor='register-phone'>Phone number</label>
                  <input id='register-phone' type='tel' name='phone' className='form-input' value={form.phone} onChange={handleChange} placeholder='e.g. 083 123 4567' autoComplete='tel' inputMode='tel' required />
                </div>
                <div className='form-row'>
                  <label className='form-label' htmlFor='register-email'>Email address</label>
                  <input id='register-email' type='email' name='email' className='form-input' value={form.email} onChange={handleChange} placeholder='you@example.com' autoComplete='email' required />
                </div>
                <div className='form-row registration-password'>
                  <label className='form-label' htmlFor='register-password'>Password</label>
                  <div className='password-control'>
                    <input id='register-password' type={showPassword ? 'text' : 'password'} name='password' className='form-input' value={form.password} onChange={handleChange} autoComplete='new-password' minLength='6' required />
                    <button type='button' onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <small>Use at least 6 characters.</small>
                </div>
              </div>
            </fieldset>

            <div className='registration-submit'>
              <button type='submit' className='btn' disabled={submitting || Boolean(success)}>
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
              <p className='auth-switch'>Already registered? <Link to={loginPath}>Sign in</Link></p>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Register
