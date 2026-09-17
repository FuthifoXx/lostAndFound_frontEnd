import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, updateMe, deleteMe } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import PageHeader from '../components/PageHeader'

function Profile() {
  const navigate = useNavigate()
  const { logout, updateSession } = useAuth()

  const [form, setForm] = useState({
    surname: '',
    initials: '',
    firstNames: '',
    phone: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [identityType, setIdentityType] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError('')
        const data = await getMe()
        setIdentityType(data.identityType || '')

        setForm({
          surname: data.surname || '',
          initials: data.initials || '',
          firstNames: Array.isArray(data.firstNames)
            ? data.firstNames.join(' ')
            : data.firstNames || '',
          phone: data.phone || '',
          email: data.email || '',
          password: '',
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const updatedUser = await updateMe(form)
      updateSession({ ...updatedUser, initials: form.initials })

      setSuccess('Profile updated successfully')
      setForm((currentForm) => ({ ...currentForm, password: '' }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      setError('')
      await deleteMe()
      logout()
      navigate('/')
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading your profile…</p>
      </div>
    )
  }

  return (
    <div className='profile-page'>
      <PageHeader
        title='My Profile'
        description='Keep your private matching and recovery contact details accurate.'
      />

      <div className='profile-layout'>
        <aside className='profile-summary'>
          <span className='profile-avatar' aria-hidden='true'>
            {(form.firstNames || form.email || '?').charAt(0).toUpperCase()}
          </span>
          <h2>{form.firstNames || 'Back 2 Owner member'}</h2>
          <p>{form.email}</p>
          <div className='profile-verification'>
            <strong>Private identity matching</strong>
            <span>{identityType ? identityType.replace('_', ' ') : 'Identity protected'}</span>
          </div>
          <p className='profile-privacy-note'>
            Your identity document details are protected and never shown in public item listings.
          </p>
        </aside>

        <form className='profile-form' onSubmit={handleSubmit}>
          {error && <p className='form-alert' role='alert'>{error}</p>}
          {success && <p className='alert alert-success' role='status'>{success}</p>}

          <fieldset className='profile-section'>
            <legend>Personal details</legend>
            <p>Use the names shown on your identity document.</p>
            <div className='profile-fields profile-fields-three'>
              <div className='form-row'>
                <label className='form-label' htmlFor='profile-first-names'>First names</label>
                <input id='profile-first-names' className='form-input' name='firstNames' value={form.firstNames} onChange={handleChange} autoComplete='given-name' required />
              </div>
              <div className='form-row'>
                <label className='form-label' htmlFor='profile-surname'>Surname</label>
                <input id='profile-surname' className='form-input' name='surname' value={form.surname} onChange={handleChange} autoComplete='family-name' required />
              </div>
              <div className='form-row'>
                <label className='form-label' htmlFor='profile-initials'>Initials</label>
                <input id='profile-initials' className='form-input' name='initials' value={form.initials} onChange={handleChange} required />
              </div>
            </div>
          </fieldset>

          <fieldset className='profile-section'>
            <legend>Contact and security</legend>
            <p>Used for secure account access and recovery updates.</p>
            <div className='profile-fields'>
              <div className='form-row'>
                <label className='form-label' htmlFor='profile-phone'>Phone number</label>
                <input id='profile-phone' className='form-input' type='tel' name='phone' value={form.phone} onChange={handleChange} autoComplete='tel' required />
              </div>
              <div className='form-row'>
                <label className='form-label' htmlFor='profile-email'>Email address</label>
                <input id='profile-email' className='form-input' type='email' name='email' value={form.email} onChange={handleChange} autoComplete='email' required />
              </div>
              <div className='form-row profile-password'>
                <label className='form-label' htmlFor='profile-password'>New password</label>
                <div className='password-control'>
                  <input id='profile-password' className='form-input' type={showPassword ? 'text' : 'password'} name='password' value={form.password} onChange={handleChange} placeholder='Leave blank to keep your current password' autoComplete='new-password' minLength='6' />
                  <button type='button' onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>
          </fieldset>

          <button type='submit' className='btn profile-save' disabled={saving}>
            {saving ? 'Saving…' : 'Save Profile'}
          </button>

          <section className='profile-danger' aria-labelledby='delete-account-heading'>
            <div>
              <h2 id='delete-account-heading'>Delete account</h2>
              <p>Permanently remove your profile and access to its recovery history.</p>
            </div>
            {confirmDelete ? (
              <div className='profile-delete-confirm'>
                <strong>This cannot be undone.</strong>
                <button type='button' className='btn delete-btn' onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting…' : 'Yes, Delete My Account'}
                </button>
                <button type='button' className='btn btn-hipster' onClick={() => setConfirmDelete(false)} disabled={deleting}>Cancel</button>
              </div>
            ) : (
              <button type='button' className='btn delete-btn' onClick={() => setConfirmDelete(true)}>Delete Account</button>
            )}
          </section>
        </form>
      </div>
    </div>
  )
}

export default Profile
