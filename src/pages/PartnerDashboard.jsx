import { useEffect, useState } from 'react'
import { getPartnerItems, markAsRecovered, closeCase } from '../services/api'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'

function PartnerDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleRecover = async (id) => {
    try {
      await markAsRecovered(id)

      setItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: 'recovered',
              }
            : item,
        ),
      )
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleClose = async (id) => {
    try {
      await closeCase(id)

      setItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: 'closed',
              }
            : item,
        ),
      )
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    const fetchPartnerItems = async () => {
      try {
        const data = await getPartnerItems()
        setItems(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPartnerItems()
  }, [])

  if (loading) {
    return <div className='loading'></div>
  }

  return (
    <>
      <div className='dashboard'>
        <PageHeader
          title='Partner Dashboard'
          description='Manage found items through recovery and case closure.'
        />

        {items.length === 0 ? (
          <EmptyState
            title='No uploaded items'
            description='Your branch has not uploaded any items yet.'
          />
        ) : (
          <div className='items-grid'>
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                badges={[
                  {
                    status: item.claimStatus,
                    label: `Claim: ${item.claimStatus === 'none' ? 'None' : item.claimStatus}`,
                  },
                ]}
                footer={
                  <time dateTime={item.createdAt}>
                    Added {new Date(item.createdAt).toLocaleDateString()}
                  </time>
                }
                actions={
                  <>
                  {item.status === 'claimed' && (
                    <button
                      className='btn'
                      onClick={() => handleRecover(item._id)}
                    >
                      Mark Recovered
                    </button>
                  )}

                  {item.status === 'recovered' && (
                    <button
                      className='btn delete-btn'
                      onClick={() => handleClose(item._id)}
                    >
                      Close Case
                    </button>
                  )}

                  <button
                    className='btn btn-hipster'
                    onClick={() => navigate(`/items/${item._id}/timeline`)}
                  >
                    View Timeline
                  </button>
                  </>
                }
              >
                <p>
                  <strong>Location</strong>
                  <span>{item.location}</span>
                </p>
                {item.matchedUser && (
                  <p>
                    <strong>Matched user</strong>
                    <span>{item.matchedUser.email}</span>
                  </p>
                )}
              </ItemCard>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default PartnerDashboard
