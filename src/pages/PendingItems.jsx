import { useEffect, useState } from 'react'
import { getPendingItems, approveItem, deleteLostItem } from '../services/api'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

function PendingItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setError('')
        const data = await getPendingItems()
        setItems(data)
      } catch (err) {
        setError(err.message || 'Pending items could not be loaded.')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleApprove = async (id) => {
    try {
      setProcessingId(id)
      setError('')
      setNotice('')
      await approveItem(id)

      setItems((prev) => prev.filter((item) => item._id !== id))
      setConfirmation(null)
      setNotice('Item approved. Automatic owner matching has been completed.')
    } catch (err) {
      setError(err.message || 'The item could not be approved.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (id) => {
    try {
      setProcessingId(id)
      setError('')
      setNotice('')
      await deleteLostItem(id)

      setItems((prev) => prev.filter((item) => item._id !== id))
      setConfirmation(null)
      setNotice('Item rejected and removed from the review queue.')
    } catch (err) {
      setError(err.message || 'The item could not be rejected.')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading pending items…</p>
      </div>
    )
  }

  return (
    <div className='dashboard pending-items-page'>
      <PageHeader
        title='Pending Items'
        description='Review newly uploaded items before they become publicly available.'
      />

      <section className='claim-queue-summary' aria-label='Pending item summary'>
        <StatCard value={items.length} label={items.length === 1 ? 'Item awaiting review' : 'Items awaiting review'} />
        <p>Approve only after the upload details and collection partner information have been checked.</p>
      </section>

      {notice && <p className='alert alert-success claim-feedback' role='status'>{notice}</p>}
      {error && <p className='form-alert claim-feedback' role='alert'>{error}</p>}

      {error && items.length === 0 ? null : items.length === 0 ? (
        <EmptyState
          title='No pending items'
          description='All uploaded items have been reviewed.'
        />
      ) : (
        <div className='items-grid'>
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              status='pending'
              actions={
                confirmation?.id === item._id ? (
                  <div className={`claim-decision-confirm claim-decision-${confirmation.decision}`} role='group' aria-label={`Confirm item ${confirmation.decision}`}>
                    <strong>{confirmation.decision === 'approve' ? 'Approve this item and run automatic owner matching?' : 'Reject and permanently remove this uploaded item?'}</strong>
                    <button className={`btn${confirmation.decision === 'reject' ? ' delete-btn' : ''}`} disabled={processingId === item._id} onClick={() => confirmation.decision === 'approve' ? handleApprove(item._id) : handleDelete(item._id)}>
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
              <p><strong>Partner</strong><span>{item.partner ? `${item.partner.name}${item.partner.branch ? ` — ${item.partner.branch}` : ''}` : 'No partner assigned'}</span></p>
              {item.createdAt && <p><strong>Uploaded</strong><span>{new Date(item.createdAt).toLocaleString()}</span></p>}
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default PendingItems
