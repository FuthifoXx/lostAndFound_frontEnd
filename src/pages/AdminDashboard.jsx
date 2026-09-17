import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAdminDashboardData } from '../services/api'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAdminDashboardData()
        setData(result)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className='loading'></div>

  if (!data) {
    return (
      <EmptyState
        title='Unable to load admin dashboard'
        description='Please try again later.'
      />
    )
  }

  const { stats, recentPendingItems, recentPendingClaims } = data

  return (
    <div className='dashboard'>
      <PageHeader
        title='Admin Dashboard'
        description='Review platform activity and prioritize work requiring attention.'
      />

      <div className='stats-grid'>
        <StatCard value={stats.totalItems} label='Total items' />
        <StatCard value={stats.pendingItems} label='Pending items' />
        <StatCard value={stats.matchedItems} label='Matched' />
        <StatCard value={stats.pendingClaims} label='Pending claims' />
        <StatCard value={stats.recoveredItems} label='Recovered' />
        <StatCard value={stats.closedCases} label='Closed cases' />
      </div>

      <div className='section-header'>
        <h4>Quick Actions</h4>
      </div>

      <div className='items-grid'>
        <div className='item-card' onClick={() => navigate('/admin/users')}>
          <h5>User Management</h5>
          <p>View, update, promote, or delete users.</p>
        </div>

        <div className='item-card' onClick={() => navigate('/admin/partners')}>
          <h5>Partner Management</h5>
          <p>Create, verify, and assign partners.</p>
        </div>

        <div className='item-card' onClick={() => navigate('/pending-items')}>
          <h5>Pending Items</h5>
          <p>Review uploaded found items.</p>
        </div>

        <div className='item-card' onClick={() => navigate('/admin/claims')}>
          <h5>Pending Claims</h5>
          <p>Review active ownership claims.</p>
        </div>

        <div
          className='item-card'
          onClick={() => navigate('/analytics/branches')}
        >
          <h5>Branch Performance</h5>
          <p>Compare partner recovery activity.</p>
        </div>
        <div
          className='item-card'
          onClick={() => navigate('/analytics/recovery')}
        >
          <h5>Recovery Analytics</h5>
          <p>View recovery rates and lifecycle statistics.</p>
        </div>
      </div>

      <div className='section-header'>
        <h4>Recent Pending Items</h4>

        <Link to='/pending-items' className='section-link'>
          View all
        </Link>
      </div>

      {recentPendingItems.length === 0 ? (
        <div className='empty-state'>
          <h4>No Pending Items</h4>
          <p>All uploaded items have been reviewed.</p>
        </div>
      ) : (
        <div className='items-grid'>
          {recentPendingItems.map((item) => (
            <div key={item._id} className='item-card compact-card'>
              {item.image && (
                <img src={item.image} alt={item.name} className='item-img' />
              )}

              <div className='item-header'>
                <h5>{item.name}</h5>
                <span className='status pending'>Pending</span>
              </div>

              <p className='item-desc'>{item.description}</p>

              <div className='item-footer'>
                <small>{item.location}</small>
                <small>{item.partner?.name || 'No partner'}</small>
              </div>

              <div className='item-actions'>
                <button
                  className='btn btn-hipster'
                  onClick={() => navigate(`/items/${item._id}/timeline`)}
                >
                  View Timeline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='section-header'>
        <h4>Recent Pending Claims</h4>

        <Link to='/admin/claims' className='section-link'>
          View all
        </Link>
      </div>

      {recentPendingClaims.length === 0 ? (
        <div className='empty-state'>
          <h4>No Pending Claims</h4>
          <p>All claims have been reviewed.</p>
        </div>
      ) : (
        <div className='items-grid'>
          {recentPendingClaims.map((item) => (
            <div key={item._id} className='item-card compact-card'>
              {item.image && (
                <img src={item.image} alt={item.name} className='item-img' />
              )}

              <div className='item-header'>
                <h5>{item.name}</h5>
                <span className={`status ${item.claimStatus}`}>
                  {item.claimStatus}
                </span>
              </div>

              <p className='item-desc'>{item.description}</p>

              <div className='item-footer'>
                <small>{item.matchedUser?.email || 'No claimant email'}</small>
                <small>{item.partner?.name || 'No partner'}</small>
              </div>

              <div className='item-actions'>
                <button
                  className='btn btn-hipster'
                  onClick={() => navigate(`/items/${item._id}/timeline`)}
                >
                  View Timeline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
