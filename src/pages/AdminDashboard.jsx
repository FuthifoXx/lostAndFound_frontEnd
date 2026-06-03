import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAdminDashboardData } from '../services/api'

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
      <div className='empty-state'>
        <h4>Unable to load admin dashboard</h4>
        <p>Please try again later.</p>
      </div>
    )
  }

  const { stats, recentPendingItems, recentPendingClaims } = data

  return (
    <div className='dashboard'>
      <h3 className='title'>Admin Dashboard</h3>
      <div className='title-underline'></div>

      <div className='stats-grid'>
        <div className='stat-card'>
          <h4>{stats.totalItems}</h4>
          <p>Total Items</p>
        </div>

        <div className='stat-card'>
          <h4>{stats.pendingItems}</h4>
          <p>Pending Items</p>
        </div>

        <div className='stat-card'>
          <h4>{stats.matchedItems}</h4>
          <p>Matched</p>
        </div>

        <div className='stat-card'>
          <h4>{stats.pendingClaims}</h4>
          <p>Pending Claims</p>
        </div>

        <div className='stat-card'>
          <h4>{stats.recoveredItems}</h4>
          <p>Recovered</p>
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
