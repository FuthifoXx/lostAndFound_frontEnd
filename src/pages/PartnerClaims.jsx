import { useEffect, useState } from 'react'
import { getPendingClaims, approveClaim, rejectClaim } from '../services/api'

function PartnerClaims() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getPendingClaims()
        setItems(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchClaims()
  }, [])

  const handleApprove = async (id) => {
    try {
      setProcessingId(id)
      await approveClaim(id)
      setItems((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      console.log(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id) => {
    try {
      setProcessingId(id)
      await rejectClaim(id)
      setItems((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      console.log(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <div className='loading'></div>

  return (
    <div className='dashboard'>
      <h3 className='title'>Partner Claim Requests</h3>
      <div className='title-underline'></div>

      {items.length === 0 ? (
        <div className='empty-state'>
          <h4>No Pending Claims</h4>
          <p>There are no claims waiting for your branch.</p>
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
                <span className={`status ${item.claimStatus}`}>
                  {item.claimStatus}
                </span>
              </div>

              <p className='item-desc'>{item.description}</p>

              <p>
                <strong>Location:</strong> {item.location}
              </p>

              {item.matchedUser && (
                <p>
                  <strong>Matched User:</strong> {item.matchedUser.email}
                </p>
              )}

              <div className='item-actions'>
                <button
                  className='btn'
                  disabled={processingId === item._id}
                  onClick={() => handleApprove(item._id)}
                >
                  {processingId === item._id ? 'Processing...' : 'Approve'}
                </button>

                <button
                  className='btn delete-btn'
                  disabled={processingId === item._id}
                  onClick={() => handleReject(item._id)}
                >
                  {processingId === item._id ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PartnerClaims
