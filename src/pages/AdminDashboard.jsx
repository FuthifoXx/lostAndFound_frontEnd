import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAdminDashboardData } from '../services/api'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

const quickActions = [
  { label: 'User Management', description: 'View, update, promote, or remove users.', to: '/admin/users', marker: '01' },
  { label: 'Partner Management', description: 'Create, verify, and assign partners.', to: '/admin/partners', marker: '02' },
  { label: 'Pending Items', description: 'Review newly uploaded found items.', to: '/pending-items', marker: '03' },
  { label: 'Pending Claims', description: 'Review active ownership claims.', to: '/admin/claims', marker: '04' },
  { label: 'Branch Performance', description: 'Compare partner recovery activity.', to: '/analytics/branches', marker: '05' },
  { label: 'Recovery Analytics', description: 'Review recovery and closure rates.', to: '/analytics/recovery', marker: '06' },
]

function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('')
        const result = await getAdminDashboardData()
        setData(result)
      } catch (err) {
        setError(err.message || 'The admin dashboard could not be loaded.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading admin dashboard…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className='dashboard admin-dashboard'>
        <PageHeader title='Admin Dashboard' description='Review platform activity and prioritize work requiring attention.' />
        <EmptyState title='Unable to load admin dashboard' description={error || 'Please try again later.'} />
      </div>
    )
  }

  const { stats, recentPendingItems, recentPendingClaims } = data

  return (
    <div className='dashboard admin-dashboard'>
      <PageHeader
        title='Admin Dashboard'
        description='Review platform activity and prioritize work requiring attention.'
      />

      <section className='stats-grid admin-dashboard-stats' aria-label='Platform summary'>
        <StatCard value={stats.totalItems} label='Total items' />
        <StatCard value={stats.pendingItems} label='Pending items' />
        <StatCard value={stats.matchedItems} label='Matched' />
        <StatCard value={stats.pendingClaims} label='Pending claims' />
        <StatCard value={stats.recoveredItems} label='Recovered' />
        <StatCard value={stats.closedCases} label='Closed cases' />
      </section>

      <section className='admin-actions' aria-labelledby='quick-actions-title'>
        <div className='dashboard-section-heading'>
          <div>
            <p className='dashboard-section-eyebrow'>Administration</p>
            <h2 id='quick-actions-title'>Quick actions</h2>
          </div>
        </div>
        <div className='admin-action-grid'>
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to} className='admin-action-card'>
              <span aria-hidden='true'>{action.marker}</span>
              <div>
                <h3>{action.label}</h3>
                <p>{action.description}</p>
              </div>
              <strong aria-hidden='true'>→</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className='admin-review-section' aria-labelledby='pending-items-title'>
        <div className='admin-section-heading'>
          <div><p className='dashboard-section-eyebrow'>Review queue</p><h2 id='pending-items-title'>Recent pending items</h2></div>
          <Link to='/pending-items' className='btn btn-hipster'>View all items</Link>
        </div>

      {recentPendingItems.length === 0 ? (
        <EmptyState title='No pending items' description='All uploaded items have been reviewed.' />
      ) : (
        <div className='items-grid admin-review-grid'>
          {recentPendingItems.map((item) => (
            <ItemCard key={item._id} item={item} compact actions={<button className='btn btn-hipster' onClick={() => navigate(`/items/${item._id}/timeline`)}>View Timeline</button>}>
              <p><strong>Location</strong><span>{item.location}</span></p>
              <p><strong>Partner</strong><span>{item.partner?.name || 'No partner assigned'}</span></p>
            </ItemCard>
          ))}
        </div>
      )}
      </section>

      <section className='admin-review-section' aria-labelledby='pending-claims-title'>
        <div className='admin-section-heading'>
          <div><p className='dashboard-section-eyebrow'>Ownership review</p><h2 id='pending-claims-title'>Recent pending claims</h2></div>
          <Link to='/admin/claims' className='btn btn-hipster'>View all claims</Link>
        </div>

      {recentPendingClaims.length === 0 ? (
        <EmptyState title='No pending claims' description='All ownership claims have been reviewed.' />
      ) : (
        <div className='items-grid admin-review-grid'>
          {recentPendingClaims.map((item) => (
            <ItemCard key={item._id} item={item} status={item.claimStatus} compact actions={<button className='btn btn-hipster' onClick={() => navigate(`/items/${item._id}/timeline`)}>View Timeline</button>}>
              <p><strong>Claimant</strong><span>{item.matchedUser?.email || 'No claimant email'}</span></p>
              <p><strong>Partner</strong><span>{item.partner?.name || 'No partner assigned'}</span></p>
            </ItemCard>
          ))}
        </div>
      )}
      </section>
    </div>
  )
}

export default AdminDashboard
