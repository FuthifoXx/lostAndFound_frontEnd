import { useEffect, useState } from 'react'
import { getMyItems, deleteLostItem, getDashboardStats } from '../services/api'
import { useNavigate } from 'react-router-dom'

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this item?',
    )

    if (!confirmDelete) return

    try {
      await deleteLostItem(id)

      setItems((prevItems) => prevItems.filter((item) => item._id !== id))
    } catch (err) {
      console.log(err.message)
    }
  }

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
                <span className={`status ${item.status}`}>{item.status}</span>
              </div>

              <p className='item-desc'>{item.description}</p>

              <div className='item-footer'>
                <small>{item.location}</small>
                <small>{new Date(item.dateLost).toLocaleDateString()}</small>
              </div>
              <div className='item-actions'>
                <button
                  className='btn delete-btn'
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
                <button
                  className='btn edit-btn'
                  onClick={() => navigate(`/edit-item/${item._id}`)}
                >
                  Edit
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
