import { useEffect, useState } from 'react'
import { getPartnerItems, markAsRecovered, closeCase } from '../services/api'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

function PartnerDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [updatingId, setUpdatingId] = useState('')
  const navigate = useNavigate()

  const handleRecover = async (id) => {
    try {
      setUpdatingId(id)
      setError('')
      setNotice('')
      await markAsRecovered(id)

      setItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: 'recovered',
              }
            : item,
        ),
      )
      setNotice('Recovery recorded. The case is ready for closure.')
      setPendingAction(null)
    } catch (err) {
      setError(err.message || 'The recovery could not be recorded.')
    } finally {
      setUpdatingId('')
    }
  }

  const handleClose = async (id) => {
    try {
      setUpdatingId(id)
      setError('')
      setNotice('')
      await closeCase(id)

      setItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: 'closed',
              }
            : item,
        ),
      )
      setNotice('Case closed successfully. The collection receipt is available from the timeline.')
      setPendingAction(null)
    } catch (err) {
      setError(err.message || 'The case could not be closed.')
    } finally {
      setUpdatingId('')
    }
  }

  useEffect(() => {
    const fetchPartnerItems = async () => {
      try {
        setError('')
        const data = await getPartnerItems()
        setItems(data)
      } catch (err) {
        setError(err.message || 'Partner items could not be loaded.')
      } finally {
        setLoading(false)
      }
    }

    fetchPartnerItems()
  }, [])

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading your branch workflow…</p>
      </div>
    )
  }

  const counts = {
    active: items.filter((item) => !['recovered', 'closed'].includes(item.status)).length,
    claimed: items.filter((item) => item.status === 'claimed').length,
    recovered: items.filter((item) => item.status === 'recovered').length,
    closed: items.filter((item) => item.status === 'closed').length,
  }

  return (
    <>
      <div className='dashboard partner-dashboard'>
        <PageHeader
          title='Partner Dashboard'
          description='Manage found items through recovery and case closure.'
        />

        <section className='stats-grid' aria-label='Partner workflow summary'>
          <StatCard value={items.length} label='Total items' />
          <StatCard value={counts.active} label='Active cases' />
          <StatCard value={counts.claimed} label='Ready for handover' />
          <StatCard value={counts.recovered} label='Ready to close' />
          <StatCard value={counts.closed} label='Closed cases' />
        </section>

        {notice && <p className='alert alert-success partner-feedback' role='status'>{notice}</p>}
        {error && <p className='form-alert partner-feedback' role='alert'>{error}</p>}

        {items.length === 0 ? (
          <EmptyState
            title='No uploaded items'
            description='Your branch has not uploaded any items yet.'
          />
        ) : (
          <div className='items-grid'>
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                badges={[
                  {
                    status: item.claimStatus,
                    label: `Claim: ${item.claimStatus === 'none' ? 'None' : item.claimStatus}`,
                  },
                ]}
                footer={
                  <time dateTime={item.createdAt}>
                    Added {new Date(item.createdAt).toLocaleDateString()}
                  </time>
                }
                actions={
                  <>
                  {item.status === 'claimed' && (
                    pendingAction?.id === item._id && pendingAction.type === 'recover' ? (
                      <div className='workflow-confirm' role='group' aria-label='Confirm recovery'>
                        <strong>Confirm the owner has collected this item.</strong>
                        <button className='btn' onClick={() => handleRecover(item._id)} disabled={updatingId === item._id}>
                          {updatingId === item._id ? 'Recording…' : 'Confirm Recovery'}
                        </button>
                        <button className='btn btn-hipster' onClick={() => setPendingAction(null)} disabled={updatingId === item._id}>Cancel</button>
                      </div>
                    ) : (
                      <button className='btn' onClick={() => setPendingAction({ id: item._id, type: 'recover' })}>
                        Mark Recovered
                      </button>
                    )
                  )}

                  {item.status === 'recovered' && (
                    pendingAction?.id === item._id && pendingAction.type === 'close' ? (
                      <div className='workflow-confirm' role='group' aria-label='Confirm case closure'>
                        <strong>Close this completed recovery case?</strong>
                        <button className='btn delete-btn' onClick={() => handleClose(item._id)} disabled={updatingId === item._id}>
                          {updatingId === item._id ? 'Closing…' : 'Confirm Closure'}
                        </button>
                        <button className='btn btn-hipster' onClick={() => setPendingAction(null)} disabled={updatingId === item._id}>Cancel</button>
                      </div>
                    ) : (
                      <button className='btn delete-btn' onClick={() => setPendingAction({ id: item._id, type: 'close' })}>
                        Close Case
                      </button>
                    )
                  )}

                  <button
                    className='btn btn-hipster'
                    onClick={() => navigate(`/items/${item._id}/timeline`)}
                  >
                    View Timeline
                  </button>
                  {['recovered', 'closed'].includes(item.status) && (
                    <button className='btn btn-hipster' onClick={() => navigate(`/receipts/${item._id}`)}>
                      Collection Receipt
                    </button>
                  )}
                  </>
                }
              >
                <p>
                  <strong>Location</strong>
                  <span>{item.location}</span>
                </p>
                {item.matchedUser && (
                  <p>
                    <strong>Matched user</strong>
                    <span>{item.matchedUser.email}</span>
                  </p>
                )}
              </ItemCard>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default PartnerDashboard
