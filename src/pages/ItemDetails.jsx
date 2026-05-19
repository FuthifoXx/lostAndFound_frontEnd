import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSingleItem } from '../services/api'

function ItemDetails() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getSingleItem(id)

        setItem(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  if (loading) {
    return <div className='loading'></div>
  }

  if (!item) {
    return <h3>Item not found</h3>
  }

  return (
    <div className='item-details'>
      <div className='details-card'>
        {item.image && (
          <img src={item.image} alt={item.name} className='details-img' />
        )}

        <div className='details-content'>
          <h2>{item.name}</h2>

          <p>{item.description}</p>

          <div className='details-info'>
            <p>
              <strong>Location:</strong> {item.location}
            </p>

            <p>
              <strong>Date Lost</strong>{' '}
              {new Date(item.dateLost).toLocaleDateString()}
            </p>

            <p>
              <strong>Status:</strong>{' '}
              <span className={`status-badge ${item.status}`}>
                {item.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetails
