import { useEffect, useState } from 'react'
import { getAdminDashboardData } from '../services/api'

function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

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
  if (!data) return <p>Unable to load admin dashboard</p>

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

      <h4>Recent Pending Items</h4>
      <div className='items-grid'>
        {recentPendingItems.map((item) => (
          <div key={item._id} className='item-card'>
            <h5>{item.name}</h5>
            <p>{item.description}</p>
            <small>{item.location}</small>
          </div>
        ))}
      </div>

      <h4 style={{ marginTop: '2rem' }}>Recent Pending Claims</h4>
      <div className='items-grid'>
        {recentPendingClaims.map((item) => (
          <div key={item._id} className='item-card'>
            <h5>{item.name}</h5>
            <p>{item.description}</p>
            <small>{item.matchedUser?.email || 'No claimant email'}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
