import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getItemTimeline,
  getCaseNotes,
  addCaseNote,
  updateLostItemImage,
} from '../services/api'

function ItemTimeline() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState([])
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState('')
  const [imageNotice, setImageNotice] = useState('')
  const [imageWarning, setImageWarning] = useState('')

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setError('')
        const result = await getItemTimeline(id)
        setData(result)

        const notesData = await getCaseNotes(id)
        setNotes(notesData)
      } catch (err) {
        setError(err.message || 'The item timeline could not be loaded.')
      } finally {
        setLoading(false)
      }
    }

    fetchTimeline()
  }, [id])

  const handleImageUpload = async (e) => {
    e.preventDefault()

    if (uploadingImage) return

    const form = e.currentTarget
    const file = form.elements.namedItem('documentImage').files?.[0]

    setImageError('')
    setImageNotice('')
    setImageWarning('')

    if (!file) {
      setImageError('Choose an image first.')
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setImageError('Choose a JPEG, PNG, or WebP image.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Choose an image no larger than 5 MB.')
      return
    }

    if (data?.item.status !== 'pending' || data?.item.approved !== false) {
      setImageError('Document images can only be changed before approval.')
      return
    }

    try {
      setUploadingImage(true)

      const updatedItem = await updateLostItemImage(id, file)

      // Preserve populated partner and owner details from the timeline.
      setData((current) => {
        if (!current || current.item._id !== updatedItem._id) {
          return current
        }

        return {
          ...current,
          item: {
            ...current.item,
            image: updatedItem.image,
            hasProtectedImage: updatedItem.hasProtectedImage,
            updatedAt: updatedItem.updatedAt,
            status: updatedItem.status,
            approved: updatedItem.approved,
          },
        }
      })

      form.reset()
      setImageNotice('Document image saved successfully.')
      setImageWarning(updatedItem.warning || '')
    } catch (err) {
      setImageError(err.message || 'The document image could not be saved.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddNote = async (e) => {
    e.preventDefault()

    if (!note.trim()) return

    try {
      setSubmitting(true)
      setError('')
      setNotice('')

      await addCaseNote(id, note)
      const savedNotes = await getCaseNotes(id)

      setNotes(savedNotes)
      setNote('')
      setNotice('Case note saved successfully.')
    } catch (err) {
      setError(err.message || 'The case note could not be saved.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading item timeline…</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className='empty-state'>
        <h4>Timeline unavailable</h4>
        <p>We could not load this item timeline.</p>
      </div>
    )
  }

  const { item, timeline } = data

  return (
    <div className='dashboard'>
      <h3 className='title'>Item Timeline</h3>
      <div className='title-underline'></div>

      <div className='details-card timeline-card'>
        {item.image && (
          <img src={item.image} alt={item.name} className='details-img' />
        )}

        <div className='details-content'>
          <h2>{item.name}</h2>

          <p>{item.description}</p>

          <p>
            <strong>Location:</strong> {item.location}
          </p>

          {item.partner && (
            <p>
              <strong>Partner:</strong> {item.partner.name} -{' '}
              {item.partner.branch}
            </p>
          )}

          <p>
            <strong>Owner:</strong>{' '}
            {item.matchedUser
              ? `${item.matchedUser.firstNames?.join(' ')} ${
                  item.matchedUser.surname
                }`
              : 'Not yet claimed'}
          </p>

          <p>
            <strong>Claim Status:</strong> {item.claimStatus}
          </p>

          <div className='status-banner'>
            <span className={`status ${item.status}`}>
              {item.status.toUpperCase()}
            </span>
          </div>

          <div className='timeline-list'>
            {timeline.map((event) => (
              <div
                key={event.label}
                className={`timeline-item ${
                  event.completed ? 'completed' : 'pending'
                }`}
              >
                <span className='timeline-dot'></span>

                <div>
                  <h5>{event.label}</h5>

                  <small>
                    {event.date
                      ? new Date(event.date).toLocaleString()
                      : 'Not completed yet'}
                  </small>
                </div>
              </div>
            ))}
          </div>

          {['recovered', 'closed'].includes(item.status) && (
            <div className='item-actions'>
              <button
                className='btn btn-primary'
                onClick={() => navigate(`/receipts/${item._id}`)}
              >
                🧾 Create / View Collection Receipt
              </button>
            </div>
          )}
        </div>
      </div>

      {item.status === 'pending' && item.approved === false && (
        <section aria-labelledby='document-image-heading'>
          <div className='section-header'>
            <h4 id='document-image-heading'>
              {item.hasProtectedImage || item.image
                ? 'Replace document image'
                : 'Add document image'}
            </h4>
          </div>

          <form
            className='form'
            onSubmit={handleImageUpload}
            aria-busy={uploadingImage}
          >
            <p>
              You can correct the document image before approval. Replacing it
              removes the previous image.
            </p>

            {imageNotice && (
              <p className='alert alert-success' role='status'>
                {imageNotice}
              </p>
            )}

            {imageWarning && (
              <p className='form-alert' role='alert'>
                {imageWarning}
              </p>
            )}

            {imageError && (
              <p className='form-alert' role='alert'>
                {imageError}
              </p>
            )}

            <div className='form-row'>
              <label className='form-label' htmlFor='documentImage'>
                Document image
              </label>

              <input
                id='documentImage'
                name='documentImage'
                type='file'
                className='form-input'
                accept='image/jpeg,image/png,image/webp'
                aria-describedby='document-image-help'
                disabled={uploadingImage}
                required
              />

              <small id='document-image-help'>
                JPEG, PNG, or WebP. Maximum size: 5 MB.
              </small>
            </div>

            <button
              type='submit'
              className='btn btn-block'
              disabled={uploadingImage}
            >
              {uploadingImage ? 'Saving image...' : 'Save document image'}
            </button>
          </form>
        </section>
      )}

      <div className='section-header'>
        <h4>Case Notes</h4>
      </div>

      <form className='form case-note-form' onSubmit={handleAddNote}>
        {notice && (
          <p className='alert alert-success' role='status'>
            {notice}
          </p>
        )}
        {error && (
          <p className='form-alert' role='alert'>
            {error}
          </p>
        )}

        <div className='form-row'>
          <label className='form-label' htmlFor='caseNote'>
            Add Note
          </label>

          <textarea
            id='caseNote'
            className='form-textarea'
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder='e.g. Owner presented RSA ID and signed collection register.'
          />
        </div>

        <button type='submit' className='btn btn-block' disabled={submitting}>
          {submitting ? 'Saving…' : 'Add Note'}
        </button>
      </form>

      {notes.length === 0 ? (
        <div className='empty-state'>
          <h4>No Case Notes</h4>

          <p>Case notes added by partners or admins will appear here.</p>
        </div>
      ) : (
        <div className='items-grid case-notes-grid'>
          {notes.map((caseNote) => (
            <article key={caseNote._id} className='case-note-card'>
              <p className='dashboard-section-eyebrow'>Saved case note</p>
              <p className='item-desc'>{caseNote.note}</p>

              <div className='item-footer'>
                <small>{caseNote.user?.email || 'Unknown user'}</small>

                <small>{new Date(caseNote.createdAt).toLocaleString()}</small>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default ItemTimeline
