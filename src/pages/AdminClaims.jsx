import { useEffect, useState } from 'react'

import { getPendingClaims, approveClaim, rejectClaim } from '../services/api'

function AdminClaims() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

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
      await approveClaim(id)

      setItems((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleReject = async (id) => {
    try {
      await rejectClaim(id)

      setItems((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      console.log(err.message)
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
        <p className='text'>No pending claims</p>
      ) : (
        <div className='items-grid'>
          {items.map((item) => (
            <div key={item._id} className='item-card'>
              {item.image && (
                <img src={item.image} alt={item.name} className='item-img' />
              )}

              <h4>{item.name}</h4>

              <p>{item.description}</p>

              <p>
                <strong>Location:</strong> {item.location}
              </p>

              <div className='item-actions'>
                <button className='btn' onClick={() => handleApprove(item._id)}>
                  Approve
                </button>

                <button
                  className='btn delete-btn'
                  onClick={() => handleReject(item._id)}
                >
                  Reject
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
