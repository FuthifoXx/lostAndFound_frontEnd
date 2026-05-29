import { useEffect, useState } from 'react'
import { getPendingItems, approveItem, deleteLostItem } from '../services/api'

function PendingItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getPendingItems()
        setItems(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleApprove = async (id) => {
    try {
      await approveItem(id)

      setItems((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteLostItem(id)

      setItems((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      console.log(err.message)
    }
  }

  if (loading) {
    return <div className='loading'></div>
  }

  return (
    <div className='dashboard'>
      <h3 className='title'>Pending Items</h3>
      <div className="title-underline"></div>

      <div className='items-grid'>
        {items.map((item) => (
          <div key={item._id} className='item-card'>
            {item.image && (
              <img src={item.image} alt={item.name} className='item-img' />
            )}

            <h5>{item.name}</h5>

            <p>{item.description}</p>

            <small>{item.location}</small>

            <div className='item-actions'>
              <button className='btn' onClick={() => handleApprove(item._id)}>
                Approve
              </button>

              <button
                className='btn delete-btn'
                onClick={() => handleDelete(item._id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingItems
