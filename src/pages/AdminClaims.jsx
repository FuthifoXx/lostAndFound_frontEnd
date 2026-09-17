import { useEffect, useState } from 'react'

import {
  getPendingClaims,
  approveClaim,
  rejectClaim,
} from '../services/api'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

function AdminClaims() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setError('')
        const data = await getPendingClaims()

        setItems(data)
      } catch (err) {
        setError(err.message || 'Pending claims could not be loaded.')
      } finally {
        setLoading(false)
      }
    }

    fetchClaims()
  }, [])

  const handleApprove = async (id) => {
    try {
      setProcessingId(id)
      setError('')
      setNotice('')

      await approveClaim(id)

      setItems((prev) => prev.filter((item) => item._id !== id))
      setConfirmation(null)
      setNotice('Claim approved. The collection partner can proceed with owner handover.')
    } catch (err) {
      setError(err.message || 'The claim could not be approved.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id) => {
    try {
      setProcessingId(id)
      setError('')
      setNotice('')

      await rejectClaim(id)

      setItems((prev) => prev.filter((item) => item._id !== id))
      setConfirmation(null)
      setNotice('Claim rejected. The matched user may review and resubmit it.')
    } catch (err) {
      setError(err.message || 'The claim could not be rejected.')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading pending claims…</p>
      </div>
    )
  }

  return (
    <div className='dashboard admin-claims-page'>
      <PageHeader
        title='Pending Claims'
        description='Review ownership claims that require an administrator decision.'
      />

      <section className='claim-queue-summary' aria-label='Pending claim summary'>
        <StatCard value={items.length} label={items.length === 1 ? 'Claim awaiting review' : 'Claims awaiting review'} />
        <p>Approve only after the claimant’s identity and ownership evidence have been checked.</p>
      </section>

      {notice && <p className='alert alert-success claim-feedback' role='status'>{notice}</p>}
      {error && <p className='form-alert claim-feedback' role='alert'>{error}</p>}

      {error && items.length === 0 ? null : items.length === 0 ? (
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
              actions={
                confirmation?.id === item._id ? (
                  <div className={`claim-decision-confirm claim-decision-${confirmation.decision}`} role='group' aria-label={`Confirm claim ${confirmation.decision}`}>
                    <strong>{confirmation.decision === 'approve' ? 'Confirm the ownership evidence has been verified.' : 'Reject this claim and allow the user to resubmit?'}</strong>
                    <button className={`btn${confirmation.decision === 'reject' ? ' delete-btn' : ''}`} disabled={processingId === item._id} onClick={() => confirmation.decision === 'approve' ? handleApprove(item._id) : handleReject(item._id)}>
                      {processingId === item._id ? 'Processing…' : confirmation.decision === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                    </button>
                    <button className='btn btn-hipster' disabled={processingId === item._id} onClick={() => setConfirmation(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <button className='btn' onClick={() => setConfirmation({ id: item._id, decision: 'approve' })}>Approve</button>
                    <button className='btn delete-btn' onClick={() => setConfirmation({ id: item._id, decision: 'reject' })}>Reject</button>
                  </>
                )
              }
            >
              <p><strong>Location</strong><span>{item.location}</span></p>
              {item.matchedUser && <p><strong>Claimed by</strong><span>{[...(item.matchedUser.firstNames || []), item.matchedUser.surname].filter(Boolean).join(' ') || 'Matched user'}</span></p>}
              {item.matchedUser?.email && <p><strong>Claimant email</strong><span>{item.matchedUser.email}</span></p>}
              {item.partner && <p><strong>Partner</strong><span>{item.partner.name}{item.partner.branch ? ` — ${item.partner.branch}` : ''}</span></p>}
              {item.claimRequestedAt && <p><strong>Requested</strong><span>{new Date(item.claimRequestedAt).toLocaleString()}</span></p>}
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminClaims
