import { useEffect, useState } from 'react'
import { getPendingItems, approveItem, deleteLostItem } from '../services/api'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'

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
    if (!window.confirm('Reject and remove this pending item?')) return

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
      <PageHeader
        title='Pending Items'
        description='Review newly uploaded items before they become publicly available.'
      />

      {items.length === 0 ? (
        <EmptyState
          title='No pending items'
          description='All uploaded items have been reviewed.'
        />
      ) : (
        <div className='items-grid'>
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              status='pending'
              actions={
                <>
              <button className='btn' onClick={() => handleApprove(item._id)}>
                Approve
              </button>

              <button
                className='btn delete-btn'
                onClick={() => handleDelete(item._id)}
              >
                Reject
              </button>
                </>
              }
            >
              <p>
                <strong>Location</strong>
                <span>{item.location}</span>
              </p>
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default PendingItems
