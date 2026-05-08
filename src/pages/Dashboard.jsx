import { useEffect, useState } from 'react'
import { getMyItems } from '../services/api'

function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyItems()
        setItems(data)
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
