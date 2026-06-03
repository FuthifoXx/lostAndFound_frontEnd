import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getItemTimeline } from '../services/api'

function ItemTimeline() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const result = await getItemTimeline(id)
        setData(result)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTimeline()
  }, [id])

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
        </div>
      </div>
    </div>
  )
}

export default ItemTimeline
