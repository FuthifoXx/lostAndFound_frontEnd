import { useEffect, useState } from 'react'
import { getAllItems } from '../services/api'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Items() {
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getAllItems(search, page)

        setItems(data.items)
        setPages(data.pages || 1)
        setTotalItems(data.totalItems || 0)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [search, page])

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
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        {error ? (
          <p className='form-alert'>{error}</p>
        ) : items.length === 0 ? (
          <p className='text'>No approved items found</p>
        ) : (
          <>
            <p className='results-summary'>
              {totalItems} available {totalItems === 1 ? 'item' : 'items'}
            </p>

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

            {pages > 1 && (
              <nav className='pagination' aria-label='Public items pagination'>
                <button
                  type='button'
                  className='btn btn-hipster'
                  disabled={page === 1}
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                >
                  Previous
                </button>

                <span>
                  Page {page} of {pages}
                </span>

                <button
                  type='button'
                  className='btn btn-hipster'
                  disabled={page === pages}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Items
