import { useEffect, useState } from 'react'
import { getPartnerItems, markAsRecovered, closeCase } from '../services/api'
import { useNavigate } from 'react-router-dom'

function PartnerDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleRecover = async (id) => {
    try {
      await markAsRecovered(id)

      setItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: 'recovered',
              }
            : item,
        ),
      )
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleClose = async (id) => {
    try {
      await closeCase(id)

      setItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: 'closed',
              }
            : item,
        ),
      )
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    const fetchPartnerItems = async () => {
      try {
        const data = await getPartnerItems()
        setItems(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPartnerItems()
  }, [])

  if (loading) {
    return <div className='loading'></div>
  }

  return (
    <>
      <div className='dashboard'>
        <h3 className='title'>Partner Dashboard</h3>
        <div className='title-underline'></div>

        {items.length === 0 ? (
          <div className='empty-state'>
            <h4>No Uploaded Items</h4>
            <p>Your branch has not uploaded any items yet.</p>
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

                <p>
                  <strong>Claim:</strong>{' '}
                  <span className={`status ${item.claimStatus}`}>
                    {item.claimStatus}
                  </span>
                </p>

                {item.matchedUser && (
                  <p>
                    <strong>Matched User:</strong> {item.matchedUser.email}
                  </p>
                )}

                <div className='item-footer'>
                  <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                </div>

                <div className='item-action'>
                  {item.status === 'claimed' && (
                    <button
                      className='btn'
                      onClick={() => handleRecover(item._id)}
                    >
                      Mark Recovered
                    </button>
                  )}

                  {item.status === 'recovered' && (
                    <button
                      className='btn delete-btn'
                      onClick={() => handleClose(item._id)}
                    >
                      Close Case
                    </button>
                  )}

                  <button
                    className='btn btn-hipster'
                    onClick={() => navigate(`/items/${item._id}/timeline`)}
                  >
                    View Timeline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default PartnerDashboard
