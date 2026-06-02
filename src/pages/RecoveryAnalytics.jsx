import { useEffect, useState } from 'react'
import { getRecoveryAnalytics } from '../services/api'

function RecoveryAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getRecoveryAnalytics()
        setAnalytics(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) return <div className='loading'></div>

  if (!analytics) {
    return (
      <div className='empty-state'>
        <h4>No analytics available</h4>
        <p>Recovery analytics could not be loaded.</p>
      </div>
    )
  }

  return (
    <div className='dashboard'>
      <h3 className='title'>Recovery Analytics</h3>
      <div className='title-underline'></div>

      <div className='stats-grid'>
        <div className='stat-card'>
          <h4>{analytics.totalItems}</h4>
          <p>Total Items</p>
        </div>

        <div className='stat-card'>
          <h4>{analytics.matchedItems}</h4>
          <p>Matched</p>
        </div>

        <div className='stat-card'>
          <h4>{analytics.claimedItems}</h4>
          <p>Claimed</p>
        </div>

        <div className='stat-card'>
          <h4>{analytics.recoveredItems}</h4>
          <p>Recovered</p>
        </div>

        <div className='stat-card'>
          <h4>{analytics.closedCases}</h4>
          <p>Closed</p>
        </div>

        <div className='stat-card'>
          <h4>{analytics.recoveryRate}%</h4>
          <p>Recovery Rate</p>
        </div>
      </div>
    </div>
  )
}

export default RecoveryAnalytics
