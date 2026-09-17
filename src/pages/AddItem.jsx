import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createLostItem } from '../services/api'
import PageHeader from '../components/PageHeader'

const initialForm = {
  name: '', description: '', location: '', dateLost: '', identityType: 'RSA_ID',
  idNumber: '', passportNumber: '', documentNumber: '', surname: '', initials: '',
  firstNames: '', dateOfBirth: '',
}

function AddItem() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const handleChange = (event) => {
    const { name, value, files } = event.target
    if (name === 'image') {
      const selectedImage = files?.[0] || null
      if (selectedImage && !selectedImage.type.startsWith('image/')) {
        setError('Please select an image file.')
        event.target.value = ''
        return
      }
      setError('')
      setImage(selectedImage)
      setImagePreview(selectedImage ? URL.createObjectURL(selectedImage) : '')
      return
    }
    if (name === 'identityType') {
      setForm((current) => ({ ...current, identityType: value, idNumber: '', passportNumber: '', documentNumber: '' }))
      return
    }
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setSubmitting(true); setError(''); setSuccess('')
      const formData = new FormData()
      const activeIdentifier = { RSA_ID: 'idNumber', PASSPORT: 'passportNumber', OTHER: 'documentNumber' }[form.identityType]
      Object.entries(form).forEach(([key, value]) => {
        const inactive = ['idNumber', 'passportNumber', 'documentNumber'].includes(key) && key !== activeIdentifier
        if (!inactive && value) formData.append(key, value)
      })
      if (image) formData.append('image', image)
      await createLostItem(formData)
      setSuccess('Item captured successfully. Redirecting to the Partner Dashboard…')
      window.setTimeout(() => navigate('/partner'), 900)
    } catch (err) {
      setError(err.message || 'The item could not be captured.')
    } finally { setSubmitting(false) }
  }

  const identifier = {
    RSA_ID: { label: 'RSA ID Number', name: 'idNumber', value: form.idNumber, placeholder: 'e.g. 13-digit RSA ID number' },
    PASSPORT: { label: 'Passport Number', name: 'passportNumber', value: form.passportNumber, placeholder: 'Enter the passport number exactly' },
    OTHER: { label: 'Document Number', name: 'documentNumber', value: form.documentNumber, placeholder: 'e.g. student, permit or access-card number' },
  }[form.identityType]
  const today = new Date().toISOString().split('T')[0]

  return (
    <main className='upload-item-page'>
      <PageHeader title='Capture Found Item' description='Record the property and its identity details for secure approval and automatic owner matching.' />
      <form className='upload-item-form' onSubmit={handleSubmit}>
        {error && <p className='form-alert upload-feedback' role='alert'>{error}</p>}
        {success && <p className='alert alert-success upload-feedback' role='status'>{success}</p>}

        <section className='upload-form-section' aria-labelledby='item-details-heading'>
          <div className='upload-section-heading'><span>1</span><div><h2 id='item-details-heading'>Item details</h2><p>Describe what was found and where it can be collected.</p></div></div>
          <div className='upload-fields'>
            <div className='form-row'><label className='form-label' htmlFor='itemName'>Item Name</label><input id='itemName' type='text' name='name' className='form-input' value={form.name} onChange={handleChange} placeholder='e.g. Driver’s licence' required /></div>
            <div className='form-row'><label className='form-label' htmlFor='foundLocation'>Found Location</label><input id='foundLocation' type='text' name='location' className='form-input' value={form.location} onChange={handleChange} placeholder='e.g. Eastgate Shopping Centre' required /></div>
            <div className='form-row upload-field-wide'><label className='form-label' htmlFor='itemDescription'>Description</label><textarea id='itemDescription' name='description' className='form-textarea' value={form.description} onChange={handleChange} placeholder='Describe the item without exposing unnecessary private details.' required /></div>
            <div className='form-row'><label className='form-label' htmlFor='dateLost'>Date Found / Date Lost</label><input id='dateLost' type='date' name='dateLost' className='form-input' value={form.dateLost} onChange={handleChange} max={today} required /></div>
            <div className='form-row'><label className='form-label' htmlFor='itemImage'>Document Image <span>(optional)</span></label><input id='itemImage' type='file' name='image' className='form-input upload-file-input' accept='image/*' onChange={handleChange} /><small>Images are protected in public previews.</small></div>
          </div>
          {imagePreview && <div className='upload-image-preview protected-media'><img src={imagePreview} alt='' /><span className='media-privacy-label'>Protected document preview</span><button type='button' className='btn btn-hipster' onClick={() => { setImage(null); setImagePreview('') }}>Remove Image</button></div>}
        </section>

        <section className='upload-form-section' aria-labelledby='identity-heading'>
          <div className='upload-section-heading'><span>2</span><div><h2 id='identity-heading'>Matching identity</h2><p>The selected document number drives automatic matching after admin approval.</p></div></div>
          <div className='upload-fields'>
            <div className='form-row'><label className='form-label' htmlFor='identityType'>Identity Type</label><select id='identityType' name='identityType' className='form-input' value={form.identityType} onChange={handleChange} required><option value='RSA_ID'>RSA ID</option><option value='PASSPORT'>Passport</option><option value='OTHER'>Other Document</option></select></div>
            <div className='form-row'><label className='form-label' htmlFor={identifier.name}>{identifier.label}</label><input id={identifier.name} type='text' name={identifier.name} className='form-input' value={identifier.value} onChange={handleChange} placeholder={identifier.placeholder} required /></div>
            {form.identityType === 'OTHER' && <div className='form-row'><label className='form-label' htmlFor='dateOfBirth'>Date of Birth <span>(optional)</span></label><input id='dateOfBirth' type='date' name='dateOfBirth' className='form-input' value={form.dateOfBirth} onChange={handleChange} max={today} /></div>}
          </div>
        </section>

        <section className='upload-form-section' aria-labelledby='owner-clues-heading'>
          <div className='upload-section-heading'><span>3</span><div><h2 id='owner-clues-heading'>Owner clues</h2><p>Add visible name details when available; these support manual verification.</p></div></div>
          <div className='upload-fields upload-fields-three'>
            <div className='form-row'><label className='form-label' htmlFor='surname'>Surname <span>(optional)</span></label><input id='surname' type='text' name='surname' className='form-input' value={form.surname} onChange={handleChange} /></div>
            <div className='form-row'><label className='form-label' htmlFor='initials'>Initials <span>(optional)</span></label><input id='initials' type='text' name='initials' className='form-input' value={form.initials} onChange={handleChange} /></div>
            <div className='form-row'><label className='form-label' htmlFor='firstNames'>First Names <span>(optional)</span></label><input id='firstNames' type='text' name='firstNames' className='form-input' value={form.firstNames} onChange={handleChange} placeholder='e.g. first names' /></div>
          </div>
        </section>

        <div className='upload-submit'><p>New items remain pending until an administrator approves them.</p><button type='submit' className='btn' disabled={submitting || Boolean(success)}>{submitting ? 'Submitting Item…' : success ? 'Item Submitted' : 'Submit Item'}</button></div>
      </form>
    </main>
  )
}

export default AddItem
