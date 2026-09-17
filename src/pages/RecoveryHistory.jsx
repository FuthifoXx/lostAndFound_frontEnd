import { useEffect, useState } from 'react'
import { getRecoveryHistory } from '../services/api'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

function RecoveryHistory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setError('')
        const data = await getRecoveryHistory()
        setItems(data)
      } catch (err) {
        setError(err.message || 'Recovery history could not be loaded.')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading recovery history…</p>
      </div>
    )
  }

  const recoveredCount = items.filter((item) => item.status === 'recovered').length
  const closedCount = items.filter((item) => item.status === 'closed').length
  const filteredItems = statusFilter === 'all'
    ? items
    : items.filter((item) => item.status === statusFilter)

  return (
    <div className='dashboard recovery-history-page'>
      <PageHeader
        title='Recovery History'
        description='Review recovered property and completed cases.'
      />

      <section className='stats-grid recovery-history-stats' aria-label='Recovery history summary'>
        <StatCard value={items.length} label='Completed handovers' />
        <StatCard value={recoveredCount} label='Awaiting closure' />
        <StatCard value={closedCount} label='Closed cases' />
      </section>

      {error && <p className='form-alert history-feedback' role='alert'>{error}</p>}

      {items.length > 0 && (
        <div className='history-controls'>
          <div>
            <label className='form-label' htmlFor='historyStatus'>Show cases</label>
            <select id='historyStatus' className='form-input' value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value='all'>All recovered and closed cases</option>
              <option value='recovered'>Awaiting closure</option>
              <option value='closed'>Closed cases</option>
            </select>
          </div>
          <p><strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? 'record' : 'records'} shown</p>
        </div>
      )}

      {error ? null : items.length === 0 ? (
        <EmptyState
          title='No recovery history'
          description='Recovered and closed cases will appear here.'
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState title='No cases in this view' description='Choose another status to review the rest of the recovery archive.' />
      ) : (
        <div className='items-grid recovery-history-grid'>
          {filteredItems.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              actions={
                <>
                  <button className='btn btn-hipster' onClick={() => navigate(`/items/${item._id}/timeline`)}>View Timeline</button>
                  <button className='btn' onClick={() => navigate(`/receipts/${item._id}`)}>{item.status === 'closed' ? 'View Receipt' : 'Create Receipt'}</button>
                </>
              }
            >
              <p><strong>Location</strong><span>{item.location}</span></p>
              {item.partner && (
                <p><strong>Partner</strong><span>{item.partner.name}{item.partner.branch ? ` — ${item.partner.branch}` : ''}</span></p>
              )}
              {item.matchedUser && (
                <p><strong>Owner</strong><span>{item.matchedUser.email}</span></p>
              )}
              {item.recoveredAt && (
                <p><strong>Recovered</strong><span>{new Date(item.recoveredAt).toLocaleString()}</span></p>
              )}
              {item.closedAt && (
                <p><strong>Closed</strong><span>{new Date(item.closedAt).toLocaleString()}</span></p>
              )}
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecoveryHistory
