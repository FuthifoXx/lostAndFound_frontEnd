import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getMyItems, updateLostItem } from '../services/api'

function EditItem() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    dateLost: '',
  })

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const items = await getMyItems()

        const item = items.find((i) => i._id === id)

        if (item) {
          setForm({
            name: item.name || '',
            description: item.description || '',
            location: item.location || '',
            dateLost: item.dateLost ? item.dateLost.split('T')[0] : '',
          })
        }
      } catch (err) {
        console.log(err.message)
      }
    }
    fetchItem()
  }, [id])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await updateLostItem(id, form)

      navigate('/dashboard')
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h4>Edit Item</h4>

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

      <button type='submit' className='btn btn-block'>
        update Item
      </button>
    </form>
  )
}

export default EditItem
