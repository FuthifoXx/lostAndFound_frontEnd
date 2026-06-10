import { useEffect, useState } from 'react'
import { getPendingClaims, approveClaim, rejectClaim } from '../services/api'

function ClaimRequests() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getPendingClaims()
        setClaims(data)
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
      setClaims((prev) => prev.filter((claim) => claim._id !== id))
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
      setClaims((prev) => prev.filter((claim) => claim._id !== id))
    } catch (err) {
      console.log(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <div className='loading'></div>

  return (
    <div className='dashboard'>
      <h3 className='title'>Claim Requests</h3>
      <div className='title-underline'></div>

      {claims.length === 0 ? (
        <div className='empty-state'>
          <h4>No Claim Requests</h4>
          <p>There are no pending claims for review.</p>
        </div>
      ) : (
        <div className='items-grid'>
          {claims.map((item) => (
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
                  <strong>Claimed By:</strong> {item.matchedUser.email}
                </p>
              )}

              {item.partner && (
                <p>
                  <strong>Partner:</strong> {item.partner.name}
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

export default ClaimRequests
