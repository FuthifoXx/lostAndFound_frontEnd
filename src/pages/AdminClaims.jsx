import { useEffect, useState } from 'react'

import {
  getPendingClaims,
  approveClaim,
  rejectClaim,
} from '../services/api'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'

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
      <PageHeader
        title='Pending Claims'
        description='Review ownership claims that require an administrator decision.'
      />

      {items.length === 0 ? (
        <EmptyState
          title='No pending claims'
          description='All claims have been reviewed.'
        />
      ) : (
        <div className='items-grid'>
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              status={item.claimStatus}
              footer={
                <time dateTime={item.dateLost}>
                  Lost {new Date(item.dateLost).toLocaleDateString()}
                </time>
              }
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
              {item.matchedUser?.email && (
                <p><strong>Claimed by</strong><span>{item.matchedUser.email}</span></p>
              )}
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminClaims
