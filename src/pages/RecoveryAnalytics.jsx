import { useEffect, useState } from 'react'
import { getRecoveryAnalytics } from '../services/api'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

function RecoveryAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setError('')
        const data = await getRecoveryAnalytics()
        setAnalytics(data)
      } catch (err) {
        setError(err.message || 'Recovery analytics could not be loaded.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading recovery analytics…</p>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className='dashboard recovery-analytics-page'>
        <PageHeader title='Recovery Analytics' description='Track property recovery progress across your branch.' />
        <EmptyState title='Analytics unavailable' description={error || 'Recovery analytics could not be loaded.'} />
      </div>
    )
  }

  const completedItems = analytics.recoveredItems + analytics.closedCases
  const remainingItems = Math.max(analytics.totalItems - completedItems, 0)
  const recoveryRate = Number(analytics.recoveryRate) || 0

  return (
    <div className='dashboard recovery-analytics-page'>
      <PageHeader title='Recovery Analytics' description='Track property recovery progress across your branch.' />

      <section className='stats-grid recovery-analytics-stats' aria-label='Recovery performance summary'>
        <StatCard value={analytics.totalItems} label='Total items' />
        <StatCard value={analytics.matchedItems} label='Matched' />
        <StatCard value={analytics.claimedItems} label='Claimed' />
        <StatCard value={analytics.recoveredItems} label='Recovered' />
        <StatCard value={analytics.closedCases} label='Closed' />
        <StatCard value={`${analytics.recoveryRate}%`} label='Recovery rate' />
      </section>

      <section className='analytics-summary' aria-labelledby='recovery-progress-title'>
        <div className='analytics-summary-copy'>
          <p className='dashboard-section-eyebrow'>Branch performance</p>
          <h2 id='recovery-progress-title'>Recovery completion</h2>
          <p><strong>{completedItems} of {analytics.totalItems}</strong> items have reached recovered or closed status.</p>
        </div>

        <div className='analytics-progress-block'>
          <div className='analytics-progress-heading'>
            <span>Lifecycle completion</span>
            <strong>{analytics.recoveryRate}%</strong>
          </div>
          <div className='analytics-progress-track' role='progressbar' aria-label='Recovery lifecycle completion' aria-valuemin='0' aria-valuemax='100' aria-valuenow={recoveryRate}>
            <span style={{ width: `${Math.min(recoveryRate, 100)}%` }}></span>
          </div>
          <p>{remainingItems === 0 ? 'Every item in this branch has completed the recovery lifecycle.' : `${remainingItems} ${remainingItems === 1 ? 'item still needs' : 'items still need'} recovery follow-up.`}</p>
        </div>
      </section>
    </div>
  )
}

export default RecoveryAnalytics
