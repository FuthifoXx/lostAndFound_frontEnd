import { useEffect, useState } from 'react'
import { getAllItems } from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Items() {
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItems(search)

        console.log('PUBLIC ITEMS:', data)

        setItems(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [search])

  if (loading) {
    return <div className='loading'></div>
  }

  return (
    <>
      <Navbar />

      <div className='dashboard'>
        <h3 className='title'>Public Lost & Found Items</h3>
        <div className='title-underline'></div>

        <div className='form-row search-row'>
          <input
            type='text'
            className='form-input'
            placeholder='Search items...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {items.length === 0 ? (
          <p className='text'>No approved items found</p>
        ) : (
          <div className='items-grid'>
            {items.map((item) => (
              <Link
                to={`/items/${item._id}`}
                className='item-link'
                key={item._id}
              >
                <div className='item-card'>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className='item-img'
                    />
                  )}

                  <div className='item-header'>
                    <h5>{item.name}</h5>

                    <span className={`status ${item.status}`}>
                      {item.status}
                    </span>
                  </div>

                  <p className='item-desc'>{item.description}</p>

                  <div className='item-footer'>
                    <small>{item.location}</small>

                    <small>
                      {new Date(item.dateLost).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Items
