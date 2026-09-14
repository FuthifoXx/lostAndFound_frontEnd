import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getSingleItem, requestClaim } from '../services/api'
import { formatCalendarDate } from '../utils/formatCalendarDate'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

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
        setError('')
        const data = await getSingleItem(id)

        setItem(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  const isMatchedUser = user?._id === item?.matchedUser
  const canRequestClaim =
    isMatchedUser &&
    item?.status === 'matched' &&
    ['none', 'rejected'].includes(item?.claimStatus)

  const claimButtonLabel = !user
    ? 'Sign In to Claim'
    : item?.claimStatus === 'pending'
      ? 'Claim Pending'
      : item?.claimStatus === 'approved'
        ? 'Claim Approved'
        : !isMatchedUser
          ? 'Matched Owner Only'
          : item?.claimStatus === 'rejected'
            ? 'Resubmit Claim'
            : 'Claim This Item'

  return (
    <div className='public-page item-details-page'>
      <Navbar />

      <main className='item-details-shell'>
        {loading ? (
          <div className='item-details-loading' role='status'>
            <div className='loading'></div>
            <p>Loading item details…</p>
          </div>
        ) : !item ? (
          <EmptyState
            icon='!'
            title='Item could not be found'
            description={error || 'This item may no longer be publicly available.'}
          >
            <button type='button' className='btn btn-hipster' onClick={() => navigate('/items')}>
              Back to Browse Items
            </button>
          </EmptyState>
        ) : (
          <article className='public-details-card'>
            <div className={`public-details-media${item.image ? ' protected-media' : ' public-details-media-empty'}`}>
              {item.image ? (
                <>
                  <img src={item.image} alt='' className='public-details-img' />
                  <span className='media-privacy-label'>Protected document preview</span>
                </>
              ) : (
                <span>No image provided</span>
              )}
            </div>

            <div className='public-details-content'>
              <div className='public-details-heading'>
                <div>
                  <p className='landing-eyebrow'>Found property</p>
                  <h1>{item.name}</h1>
                </div>
                <StatusBadge status={item.status} />
              </div>

              {item.description && <p className='public-details-description'>{item.description}</p>}

              <dl className='public-details-meta'>
                <div>
                  <dt>Collection area</dt>
                  <dd>{item.location}</dd>
                </div>
                <div>
                  <dt>Date lost</dt>
                  <dd>{formatCalendarDate(item.dateLost)}</dd>
                </div>
              </dl>

              <section className='claim-panel' aria-labelledby='claim-heading'>
                <h2 id='claim-heading'>Think this belongs to you?</h2>
                <p>
                  Sign in and submit a claim. Your details stay private while the verified
                  collection partner reviews ownership.
                </p>

                {message && <p className='alert alert-success' role='status'>{message}</p>}
                {error && <p className='form-alert' role='alert'>{error}</p>}

                <button
                  type='button'
                  className='btn claim-btn'
                  onClick={handleClaim}
                  disabled={claimLoading || (Boolean(user) && !canRequestClaim)}
                >
                  {claimLoading ? 'Requesting…' : claimButtonLabel}
                </button>

                {!user && <small>You’ll return here after signing in.</small>}
              </section>
            </div>
          </article>
        )}
      </main>
    </div>
  )
}

export default ItemDetails
