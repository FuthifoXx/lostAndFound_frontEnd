import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createLostItem } from '../services/api'
import Navbar from '../components/Navbar'

function AddItem() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    dateLost: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [image, setImage] = useState(null)

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === 'image') {
      setImage(files[0])
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError('')
      setSuccess('')

      const formData = new FormData()

      //append text fields
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key])
      })

      //append image
      if (image) {
        formData.append('image', image)
      }

      await createLostItem(formData)

      setSuccess('Item added successfully')

      // 🔁 Redirect after 1 second
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Navbar />

      <form className='form' onSubmit={handleSubmit}>
        <h4>Add Lost Item</h4>

        {error && <p className='form-alert'>{error}</p>}
        {success && <p className='alert alert-success'>{success}</p>}

        <div className='form-row'>
          <label className='form-label'>Name</label>
          <input
            type='text'
            name='name'
            className='form-input'
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className='form-row'>
          <label className='form-label'>Description</label>
          <textarea
            name='description'
            className='form-textarea'
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className='form-row'>
          <label className='form-label'>Location</label>
          <input
            type='text'
            name='location'
            className='form-input'
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className='form-row'>
          <label className='form-label'>Date Lost</label>
          <input
            type='date'
            name='dateLost'
            className='form-input'
            value={form.dateLost}
            onChange={handleChange}
          />
        </div>

        <div className='form-row'>
          <label className='form-label'>Upload Image</label>
          <input
            type='file'
            name='image'
            className='form-input'
            onChange={handleChange}
          />
        </div>

        <button type='submit' className='btn btn-block'>
          Submit Item
        </button>
      </form>
    </>
  )
}

export default AddItem
