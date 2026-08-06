import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getItemTimeline, getCaseNotes, addCaseNote } from '../services/api'

function ItemTimeline() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState([])
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const result = await getItemTimeline(id)
        setData(result)

        const notesData = await getCaseNotes(id)
        setNotes(notesData)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTimeline()
  }, [id])

  const handleAddNote = async (e) => {
    e.preventDefault()

    if (!note.trim()) return

    try {
      setSubmitting(true)

      const newNote = await addCaseNote(id, note)

      setNotes((prev) => [newNote, ...prev])
      setNote('')
    } catch (err) {
      console.log(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className='loading'></div>

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
                🧾 View Collection Receipt
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='section-header'>
        <h4>Case Notes</h4>
      </div>

      <form className='form' onSubmit={handleAddNote}>
        <div className='form-row'>
          <label className='form-label'>Add Note</label>

          <textarea
            className='form-textarea'
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder='e.g. Owner presented RSA ID and signed collection register.'
          />
        </div>

        <button type='submit' className='btn btn-block' disabled={submitting}>
          {submitting ? 'Saving...' : 'Add Note'}
        </button>
      </form>

      {notes.length === 0 ? (
        <div className='empty-state'>
          <h4>No Case Notes</h4>

          <p>Case notes added by partners or admins will appear here.</p>
        </div>
      ) : (
        <div className='items-grid'>
          {notes.map((caseNote) => (
            <div key={caseNote._id} className='item-card'>
              <p className='item-desc'>{caseNote.note}</p>

              <div className='item-footer'>
                <small>{caseNote.user?.email || 'Unknown user'}</small>

                <small>{new Date(caseNote.createdAt).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ItemTimeline
