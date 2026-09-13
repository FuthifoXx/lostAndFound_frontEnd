import { useEffect, useState } from 'react'
import { getMyItems, getDashboardStats } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { formatCalendarDate } from '../utils/formatCalendarDate'

function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalItems: 0,
    matchedItems: 0,
    pendingClaims: 0,
    recoveredItems: 0,
    closedCases: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyItems()
        setItems(data)

        const statsData = await getDashboardStats()
        setStats(statsData)
      } catch (err) {
        console.log('ERROR:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className='loading'></div>
  }

  return (
    <div className='dashboard'>
      <h3 className='title'>My Lost Items</h3>
      <div className='title-underline'></div>

      <div className='stats-grid'>
        <div className='stat-card'>
          <h4>{stats.totalItems}</h4>
          <p>Total Items</p>
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

        <div className='stat-card'>
          <h4>{stats.closedCases}</h4>
          <p>Closed Cases</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className='text'>No items found</p>
      ) : (
        <div className='items-grid'>
          {items.map((item) => (
            <div key={item._id} className='item-card'>
              {item.image && (
                <img src={item.image} alt={item.name} className='item-img' />
              )}
              <div className='item-header'>
                <h5>{item.name}</h5>
                <div>
                  <span className={`status ${item.status}`}>{item.status}</span>
                  {item.claimStatus === 'pending' && (
                    <span className='status pending'>Pending Claim</span>
                  )}
                </div>
              </div>

              <p className='item-desc'>{item.description}</p>

              <div className='item-footer'>
                <small>{item.location}</small>
                <small>{formatCalendarDate(item.dateLost)}</small>
              </div>
              <div className='item-actions'>
                <button
                  className='btn btn-block'
                  onClick={() => navigate(`/items/${item._id}`)}
                >
                  {item.claimStatus === 'pending'
                    ? 'View Pending Claim'
                    : item.claimStatus === 'rejected'
                      ? 'Review & Resubmit Claim'
                      : 'View Item / Claim'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
