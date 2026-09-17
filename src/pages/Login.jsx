import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError('')
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      console.log(err)
      setError(err.message)
      setForm((currentForm) => ({ ...currentForm, password: '' }))
    }
  }

  return (
    <>
      <Navbar />

      <form className='form' onSubmit={handleSubmit}>
        <h4>Login</h4>

        {error && <p className='form-alert'>{error}</p>}

        <div className='form-row'>
          <label>Email</label>
          <input
            type='email'
            name='email'
            className='form-input'
            value={form.email}
            onChange={handleChange}
            autoComplete='email'
          />
        </div>

        <div className='form-row'>
          <label>Password</label>
          <input
            type='password'
            name='password'
            className='form-input'
            value={form.password}
            onChange={handleChange}
            autoComplete='current-password'
          />
        </div>

        <button type='submit' className='btn btn-block'>
          Login
        </button>
      </form>
    </>
  )
}

export default Login
