import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSingleItem, requestClaim } from '../services/api'

function ItemDetails() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [claimLoading, setClaimLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, seError] = useState('')

  const handleClaim = async () => {
    try {
      setClaimLoading(true)
      setError('')
      setMessage('')

      const data = await requestClaim(item._id)

      setMessage(data.message)
    } catch (err) {
      setError(err.message)
    } finally {
      setClaimLoading(false)
    }
  }

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getSingleItem(id)

        setItem(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  if (loading) {
    return <div className='loading'></div>
  }

  if (!item) {
    return <h3>Item not found</h3>
  }

  return (
    <div className='item-details'>
      <div className='details-card'>
        {item.image && (
          <img src={item.image} alt={item.name} className='details-img' />
        )}

        <div className='details-content'>
          <h2>{item.name}</h2>

          <p>{item.description}</p>

          <div className='details-info'>
            <p>
              <strong>Location:</strong> {item.location}
            </p>

            <p>
              <strong>Date Lost</strong>{' '}
              {new Date(item.dateLost).toLocaleDateString()}
            </p>

            <p>
              <strong>Status:</strong>{' '}
              <span className={`status-badge ${item.status}`}>
                {item.status}
              </span>
            </p>

            {message && <p className='alert alert-success'>{message}</p>}

            {error && <p className='form-alert'>{error}</p>}

            <button
              className='btn claim-btn'
              onClick={handleClaim}
              disabled={claimLoading}
            >
              {claimLoading ? 'Requesting...' : 'Claim This Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetails
