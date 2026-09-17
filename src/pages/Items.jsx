import { useEffect, useState } from 'react'
import { getAllItems } from '../services/api'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import ItemCard from '../components/ItemCard'
import EmptyState from '../components/EmptyState'
import { formatCalendarDate } from '../utils/formatCalendarDate'

function Items() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getAllItems(debouncedSearch, page)

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
  }, [debouncedSearch, page])

  return (
    <div className='public-page browse-page'>
      <Navbar />

      <main className='public-content'>
        <PageHeader
          title='Browse Found Items'
          description='Search approved property held securely by verified collection partners.'
        />

        <div className='public-search'>
          <label htmlFor='item-search'>Search by item, description, or location</label>
          <div className='search-control'>
            <input
              id='item-search'
              type='text'
              className='form-input'
              placeholder='e.g. wallet, passport, Katlehong'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
            {search && (
              <button type='button' onClick={() => setSearch('')}>
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className='browse-loading' role='status'>
            <div className='loading'></div>
            <p>Searching approved items…</p>
          </div>
        ) : error ? (
          <EmptyState
            icon='!'
            title='Items could not be loaded'
            description={error}
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon='⌕'
            title={debouncedSearch ? 'No matching items' : 'No items available yet'}
            description={
              debouncedSearch
                ? `Try a broader search instead of “${debouncedSearch}”.`
                : 'Approved found property will appear here.'
            }
          >
            {debouncedSearch && (
              <button type='button' className='btn btn-hipster' onClick={() => setSearch('')}>
                Clear search
              </button>
            )}
          </EmptyState>
        ) : (
          <>
            <div className='browse-results-heading' aria-live='polite'>
              <p>
                <strong>{totalItems}</strong> approved {totalItems === 1 ? 'item' : 'items'}
                {debouncedSearch && <> matching “{debouncedSearch}”</>}
              </p>
              <span>Open an item to review its claim details.</span>
            </div>

            <div className='items-grid public-items-grid'>
              {items.map((item) => (
                <Link
                  to={`/items/${item._id}`}
                  className='item-link public-item-link'
                  key={item._id}
                >
                  <ItemCard
                    item={item}
                    footer={
                      <>
                        <span>Lost {formatCalendarDate(item.dateLost)}</span>
                        <strong>View details →</strong>
                      </>
                    }
                  >
                    <p className='public-card-location'>
                      <strong>Collection area</strong>
                      <span>{item.location}</span>
                    </p>
                  </ItemCard>
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
      </main>
    </div>
  )
}

export default Items
