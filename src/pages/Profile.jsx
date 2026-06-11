import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, updateMe, deleteMe } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [form, setForm] = useState({
    surname: '',
    initials: '',
    firstNames: '',
    phone: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe()

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
        console.log(err.message)
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
      setError('')
      setSuccess('')

      await updateMe(form)

      setSuccess('Profile updated successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This cannot be undone.',
    )

    if (!confirmDelete) return

    try {
      await deleteMe()
      logout()
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className='loading'></div>

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h4>My Profile</h4>

      {error && <p className='form-alert'>{error}</p>}
      {success && <p className='alert alert-success'>{success}</p>}

      <div className='form-row'>
        <label className='form-label'>Surname</label>
        <input
          className='form-input'
          name='surname'
          value={form.surname}
          onChange={handleChange}
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>Initials</label>
        <input
          className='form-input'
          name='initials'
          value={form.initials}
          onChange={handleChange}
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>First Names</label>
        <input
          className='form-input'
          name='firstNames'
          value={form.firstNames}
          onChange={handleChange}
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>Phone</label>
        <input
          className='form-input'
          name='phone'
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>Email</label>
        <input
          className='form-input'
          type='email'
          name='email'
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>New Password</label>
        <input
          className='form-input'
          type='password'
          name='password'
          value={form.password}
          onChange={handleChange}
          placeholder='Leave blank to keep old password'
        />
      </div>

      <button type='submit' className='btn btn-block'>
        Update Profile
      </button>

      <button
        type='button'
        className='btn delete-btn btn-block'
        style={{ marginTop: '1rem' }}
        onClick={handleDelete}
      >
        Delete Account
      </button>
    </form>
  )
}

export default Profile
