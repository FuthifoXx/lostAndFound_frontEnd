import { useEffect, useState } from 'react'
import { getMyItems, getDashboardStats } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { formatCalendarDate } from '../utils/formatCalendarDate'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

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
      <PageHeader
        title='My Lost Items'
        description='Track matches, claims and recovered property in one place.'
      />

      <div className='stats-grid'>
        <StatCard value={stats.totalItems} label='Total items' />
        <StatCard value={stats.matchedItems} label='Matched' />
        <StatCard value={stats.pendingClaims} label='Pending claims' />
        <StatCard value={stats.recoveredItems} label='Recovered' />
        <StatCard value={stats.closedCases} label='Closed cases' />
      </div>

      {items.length === 0 ? (
        <EmptyState
          title='No lost items'
          description='Matched lost-property records will appear here.'
        />
      ) : (
        <div className='items-grid'>
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              badges={
                item.claimStatus === 'pending'
                  ? [{ status: 'pending', label: 'Claim pending' }]
                  : []
              }
              footer={
                <>
                  <span>{item.location}</span>
                  <time dateTime={item.dateLost}>
                    {formatCalendarDate(item.dateLost)}
                  </time>
                </>
              }
              actions={
                <button
                  className='btn btn-block'
                  onClick={() => navigate(`/items/${item._id}`)}
                >
                  {item.claimStatus === 'pending'
                    ? 'View Pending Claim'
                    : item.claimStatus === 'rejected'
                      ? 'Review & Resubmit Claim'
                      : 'View Item / Claim'}
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
