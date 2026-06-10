import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'

function Register() {
  const navigate = useNavigate()

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

      await registerUser(form)

      setSuccess('Registration successful. Please login.')

      setTimeout(() => {
        navigate('/login')
      }, 1000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h4>Register</h4>

      {error && <p className='form-alert'>{error}</p>}
      {success && <p className='alert alert-success'>{success}</p>}

      <div className='form-row'>
        <label className='form-label'>Identity Type</label>
        <select
          name='identityType'
          className='form-input'
          value={form.identityType}
          onChange={handleChange}
        >
          <option value='RSA_ID'>RSA ID</option>
          <option value='PASSPORT'>Passport</option>
          <option value='OTHER'>Other Document</option>
        </select>
      </div>

      {form.identityType === 'RSA_ID' && (
        <div className='form-row'>
          <label className='form-label'>RSA ID Number</label>
          <input
            type='text'
            name='idNumber'
            className='form-input'
            value={form.idNumber}
            onChange={handleChange}
          />
        </div>
      )}

      {form.identityType === 'PASSPORT' && (
        <div className='form-row'>
          <label className='form-label'>Passport Number</label>
          <input
            type='text'
            name='passportNumber'
            className='form-input'
            value={form.passportNumber}
            onChange={handleChange}
          />
        </div>
      )}

      {form.identityType === 'OTHER' && (
        <div className='form-row'>
          <label className='form-label'>Document Number</label>
          <input
            type='text'
            name='documentNumber'
            className='form-input'
            value={form.documentNumber}
            onChange={handleChange}
          />
        </div>
      )}

      <div className='form-row'>
        <label className='form-label'>Surname</label>
        <input
          type='text'
          name='surname'
          className='form-input'
          value={form.surname}
          onChange={handleChange}
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>Initials</label>
        <input
          type='text'
          name='initials'
          className='form-input'
          value={form.initials}
          onChange={handleChange}
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>First Names</label>
        <input
          type='text'
          name='firstNames'
          className='form-input'
          value={form.firstNames}
          onChange={handleChange}
          placeholder='e.g. Gladman Mfanafuthi'
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>Phone</label>
        <input
          type='text'
          name='phone'
          className='form-input'
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>Email</label>
        <input
          type='email'
          name='email'
          className='form-input'
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>Password</label>
        <input
          type='password'
          name='password'
          className='form-input'
          value={form.password}
          onChange={handleChange}
        />
      </div>

      <button type='submit' className='btn btn-block'>
        Register
      </button>
    </form>
  )
}

export default Register
