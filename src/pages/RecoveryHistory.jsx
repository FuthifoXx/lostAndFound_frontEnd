import { useEffect, useState } from 'react'
import { getRecoveryHistory } from '../services/api'
import { useNavigate } from 'react-router-dom'

function RecoveryHistory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getRecoveryHistory()
        setItems(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return <div className='loading'></div>
  }

  return (
    <div className='dashboard'>
      <h3 className='title'>Recovery History</h3>
      <div className='title-underline'></div>

      {items.length === 0 ? (
        <div className='empty-state'>
          <h4>No Recovery History</h4>
          <p>Recovered and closed cases will appear here.</p>
        </div>
      ) : (
        <div className='items-grid'>
          {items.map((item) => (
            <div key={item._id} className='item-card'>
              {item.image && (
                <img src={item.image} alt={item.name} className='item-img' />
              )}

              <div className='item-header'>
                <h5>{item.name}</h5>
                <span className={`status ${item.status}`}>{item.status}</span>
              </div>

              <p className='item-desc'>{item.description}</p>

              <p>
                <strong>Location:</strong> {item.location}
              </p>

              {item.partner && (
                <p>
                  <strong>Partner:</strong> {item.partner.name}
                </p>
              )}

              {item.matchedUser && (
                <p>
                  <strong>Owner:</strong> {item.matchedUser.email}
                </p>
              )}

              {item.recoveredAt && (
                <p>
                  <strong>Recovered:</strong>{' '}
                  {new Date(item.recoveredAt).toLocaleDateString()}
                </p>
              )}

              {item.closedAt && (
                <p>
                  <strong>Closed:</strong>{' '}
                  {new Date(item.closedAt).toLocaleDateString()}
                </p>
              )}
              <button
                className='btn btn-hipster'
                onClick={() => navigate(`/items/${item._id}/timeline`)}
              >
                View Timeline
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecoveryHistory
