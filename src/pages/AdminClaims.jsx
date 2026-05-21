import { useEffect, useState } from 'react'

import { getPendingClaims, approveClaim, rejectClaim } from '../services/api'

function AdminClaims() {
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

  if (loading) {
    return <div className='loading'></div>
  }

  return (
    <div className='dashboard'>
      <h3 className='title'>Pending Claims</h3>

      <div className='title-underline'></div>

      {items.length === 0 ? (
        <div className='empty-state'>
          <h4>No Pending Claims</h4>

          <p>All claims have been reviewed</p>
        </div>
      ) : (
        <div className='items-grid'>
          {items.map((item) => (
            <div key={item._id} className='item-card'>
              {item.image && (
                <img src={item.image} alt={item.name} className='item-img' />
              )}

              <div className='claim-content'>
                <h4>{item.name}</h4>

                <p className='item-desc'>{item.description}</p>

                <p>
                  <strong>Location:</strong> {item.location}
                </p>

                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(item.dateLost).toLocaleDateString()}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status ${item.claimStatus}`}>
                    {item.claimStatus}
                  </span>
                </p>
              </div>

              {/* {item.claimedBy && (
              <p>
                <strong>Claimed By:</strong>{' '}
                {item.claimedBy.email}
              </p>
              )} */}

              {item.matchedUser?.email && (
                <p>
                  <strong>Claimed By:</strong> {item.matchedUser.email}
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

export default AdminClaims
