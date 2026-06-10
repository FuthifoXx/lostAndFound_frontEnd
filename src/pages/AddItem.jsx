import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createLostItem } from '../services/api'

function AddItem() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    dateLost: '',
    identityType: 'RSA_ID',
    idNumber: '',
    passportNumber: '',
    documentNumber: '',
    surname: '',
    initials: '',
    firstNames: '',
    dateOfBirth: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [image, setImage] = useState(null)

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === 'image') {
      setImage(files[0])
      return
    }

    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError('')
      setSuccess('')

      const formData = new FormData()

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key])
      })

      if (image) {
        formData.append('image', image)
      }

      await createLostItem(formData)

      setSuccess('Item captured successfully')

      setTimeout(() => {
        navigate('/partner')
      }, 1000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h4>Capture Found Item</h4>

      {error && <p className='form-alert'>{error}</p>}
      {success && <p className='alert alert-success'>{success}</p>}

      <div className='form-row'>
        <label className='form-label'>Item Name</label>
        <input
          type='text'
          name='name'
          className='form-input'
          value={form.name}
          onChange={handleChange}
          placeholder='e.g. Drivers Licence'
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>Description</label>
        <textarea
          name='description'
          className='form-textarea'
          value={form.description}
          onChange={handleChange}
          placeholder='e.g. Card licence'
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>Found Location</label>
        <input
          type='text'
          name='location'
          className='form-input'
          value={form.location}
          onChange={handleChange}
          placeholder='e.g. East Gate Shopping Mall'
        />
      </div>

      <div className='form-row'>
        <label className='form-label'>Date Found / Date Lost</label>
        <input
          type='date'
          name='dateLost'
          className='form-input'
          value={form.dateLost}
          onChange={handleChange}
        />
      </div>

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
            placeholder='e.g. 7908145414089'
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
        <>
          <div className='form-row'>
            <label className='form-label'>Document Number</label>
            <input
              type='text'
              name='documentNumber'
              className='form-input'
              value={form.documentNumber}
              onChange={handleChange}
              placeholder='e.g. Student number / permit number'
            />
          </div>

          <div className='form-row'>
            <label className='form-label'>Date of Birth</label>
            <input
              type='date'
              name='dateOfBirth'
              className='form-input'
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </div>
        </>
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
  )
}

export default AddItem
