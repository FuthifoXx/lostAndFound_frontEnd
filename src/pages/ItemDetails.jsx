import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getSingleItem, requestClaim } from '../services/api'
import { formatCalendarDate } from '../utils/formatCalendarDate'

function ItemDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [claimLoading, setClaimLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleClaim = async () => {
    if (!user) {
      const returnTo = `${location.pathname}${location.search}`
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`)
      return
    }

    try {
      setClaimLoading(true)
      setError('')
      setMessage('')

      const data = await requestClaim(item._id)

      setMessage(data.message)
      setItem(data.item)
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

  const isMatchedUser = user?._id === item.matchedUser
  const canRequestClaim =
    isMatchedUser &&
    item.status === 'matched' &&
    ['none', 'rejected'].includes(item.claimStatus)

  const claimButtonLabel = !user
    ? 'Sign In to Claim'
    : item.claimStatus === 'pending'
      ? 'Claim Pending'
      : item.claimStatus === 'approved'
        ? 'Claim Approved'
        : !isMatchedUser
          ? 'Matched Owner Only'
          : item.claimStatus === 'rejected'
            ? 'Resubmit Claim'
            : 'Claim This Item'

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
              {formatCalendarDate(item.dateLost)}
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
              disabled={claimLoading || (Boolean(user) && !canRequestClaim)}
            >
              {claimLoading ? 'Requesting...' : claimButtonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetails
