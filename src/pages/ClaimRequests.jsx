import { useEffect, useState } from 'react'
import { getPendingClaims, approveClaim, rejectClaim } from '../services/api'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'

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
      <PageHeader
        title='Claim Requests'
        description='Review ownership claims that require a partner decision.'
      />

      {claims.length === 0 ? (
        <EmptyState
          title='No claim requests'
          description='There are no pending claims for review.'
        />
      ) : (
        <div className='items-grid'>
          {claims.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              status={item.claimStatus}
              actions={
                <>
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
                </>
              }
            >
              <p><strong>Location</strong><span>{item.location}</span></p>
              {item.matchedUser && (
                <p><strong>Claimed by</strong><span>{item.matchedUser.email}</span></p>
              )}
              {item.partner && (
                <p><strong>Partner</strong><span>{item.partner.name}</span></p>
              )}
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClaimRequests
