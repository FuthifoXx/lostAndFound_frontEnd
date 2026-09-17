import { useEffect, useState } from 'react'
import { getMyItems, getDashboardStats } from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
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
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('')
        const [data, statsData] = await Promise.all([
          getMyItems(),
          getDashboardStats(),
        ])

        setItems(data)
        setStats(statsData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Preparing your recovery dashboard…</p>
      </div>
    )
  }

  return (
    <div className='dashboard user-dashboard'>
      <PageHeader
        title='My Recovery Dashboard'
        description='Track matched property, claim decisions and completed recoveries in one secure place.'
      />

      <div className='stats-grid'>
        <StatCard value={stats.totalItems} label='Total items' />
        <StatCard value={stats.matchedItems} label='Matched' />
        <StatCard value={stats.pendingClaims} label='Pending claims' />
        <StatCard value={stats.recoveredItems} label='Recovered' />
        <StatCard value={stats.closedCases} label='Closed cases' />
      </div>

      <div className='dashboard-section-heading'>
        <div>
          <p className='dashboard-section-eyebrow'>Recovery activity</p>
          <h2>Your matched property</h2>
        </div>
        <Link to='/items' className='btn btn-hipster'>Browse Found Items</Link>
      </div>

      {error ? (
        <EmptyState
          icon='!'
          title='Dashboard could not be loaded'
          description={error}
        >
          <button type='button' className='btn btn-hipster' onClick={() => window.location.reload()}>
            Try again
          </button>
        </EmptyState>
      ) : items.length === 0 ? (
        <EmptyState
          icon='⌕'
          title='No matched property yet'
          description='Browse approved items now, or return later when private identity matching finds a possible match.'
        >
          <button type='button' className='btn' onClick={() => navigate('/items')}>
            Browse Found Items
          </button>
        </EmptyState>
      ) : (
        <div className='items-grid user-items-grid'>
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
