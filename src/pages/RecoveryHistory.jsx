import { useEffect, useState } from 'react'
import { getRecoveryHistory } from '../services/api'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'

function RecoveryHistory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getRecoveryHistory()
        setItems(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return <div className='loading'></div>
  }

  return (
    <div className='dashboard'>
      <PageHeader
        title='Recovery History'
        description='Review recovered property and completed cases.'
      />

      {items.length === 0 ? (
        <EmptyState
          title='No recovery history'
          description='Recovered and closed cases will appear here.'
        />
      ) : (
        <div className='items-grid'>
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              actions={
                <button
                  className='btn btn-hipster'
                  onClick={() => navigate(`/items/${item._id}/timeline`)}
                >
                  View Timeline
                </button>
              }
            >
              <p><strong>Location</strong><span>{item.location}</span></p>
              {item.partner && (
                <p><strong>Partner</strong><span>{item.partner.name}</span></p>
              )}
              {item.matchedUser && (
                <p><strong>Owner</strong><span>{item.matchedUser.email}</span></p>
              )}
              {item.recoveredAt && (
                <p><strong>Recovered</strong><span>{new Date(item.recoveredAt).toLocaleDateString()}</span></p>
              )}
              {item.closedAt && (
                <p><strong>Closed</strong><span>{new Date(item.closedAt).toLocaleDateString()}</span></p>
              )}
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecoveryHistory
