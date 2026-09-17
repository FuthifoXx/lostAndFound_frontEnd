import { useEffect, useState } from 'react'
import { getBranchPerformance } from '../services/api'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

function BranchPerformance() {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('rate')

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setError('')
        const data = await getBranchPerformance()
        setBranches(data)
      } catch (err) {
        setError(err.message || 'Branch performance could not be loaded.')
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading branch performance…</p>
      </div>
    )
  }

  const totals = branches.reduce((summary, branch) => ({
    items: summary.items + branch.totalItems,
    completed: summary.completed + branch.recoveredItems + branch.closedCases,
    matched: summary.matched + branch.matchedItems,
  }), { items: 0, completed: 0, matched: 0 })
  const networkRate = totals.items > 0 ? ((totals.completed / totals.items) * 100).toFixed(1) : '0.0'
  const sortedBranches = [...branches].sort((a, b) => {
    if (sortBy === 'items') return b.totalItems - a.totalItems
    if (sortBy === 'name') return `${a.partnerName} ${a.branch}`.localeCompare(`${b.partnerName} ${b.branch}`)
    return b.recoveryRate - a.recoveryRate
  })

  return (
    <div className='dashboard branch-performance-page'>
      <PageHeader title='Branch Performance' description='Compare partner workload and property recovery outcomes across the platform.' />

      <section className='stats-grid branch-performance-stats' aria-label='Branch network summary'>
        <StatCard value={branches.length} label='Active branches' />
        <StatCard value={totals.items} label='Partner items' />
        <StatCard value={totals.completed} label='Completed recoveries' />
        <StatCard value={`${networkRate}%`} label='Network recovery rate' />
      </section>

      {error && <p className='form-alert branch-performance-feedback' role='alert'>{error}</p>}

      {error && branches.length === 0 ? null : branches.length === 0 ? (
        <EmptyState title='No branch data' description='Partner branch performance will appear here as items are processed.' />
      ) : (
        <>
          <div className='branch-performance-controls'>
            <div>
              <label className='form-label' htmlFor='branchSort'>Rank branches by</label>
              <select id='branchSort' className='form-input' value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value='rate'>Recovery rate</option>
                <option value='items'>Item volume</option>
                <option value='name'>Partner name</option>
              </select>
            </div>
            <p><strong>{totals.matched}</strong> matched {totals.matched === 1 ? 'item' : 'items'} across the network</p>
          </div>

          <div className='branch-performance-grid'>
            {sortedBranches.map((branch, index) => {
              const completed = branch.recoveredItems + branch.closedCases
              const rate = Number(branch.recoveryRate) || 0

              return <article key={branch.partnerId} className='branch-performance-card'>
                <div className='branch-performance-heading'>
                  <span aria-label={`Rank ${index + 1}`}>#{index + 1}</span>
                  <div><h2>{branch.partnerName}</h2><p>{branch.branch}</p></div>
                  <strong>{rate.toFixed(1)}%</strong>
                </div>
                <p className='branch-address'>{branch.address || 'No address provided'}</p>

                <dl className='branch-metrics'>
                  <div><dt>Total items</dt><dd>{branch.totalItems}</dd></div>
                  <div><dt>Matched</dt><dd>{branch.matchedItems}</dd></div>
                  <div><dt>Recovered</dt><dd>{branch.recoveredItems}</dd></div>
                  <div><dt>Closed</dt><dd>{branch.closedCases}</dd></div>
                </dl>

                <div className='branch-progress-heading'><span>Lifecycle completion</span><strong>{completed} of {branch.totalItems}</strong></div>
                <div className='analytics-progress-track' role='progressbar' aria-label={`${branch.partnerName} ${branch.branch} recovery rate`} aria-valuemin='0' aria-valuemax='100' aria-valuenow={rate}>
                  <span style={{ width: `${Math.min(rate, 100)}%` }}></span>
                </div>
              </article>
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default BranchPerformance
