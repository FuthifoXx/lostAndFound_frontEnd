import { useEffect, useState } from 'react'
import { getBranchPerformance } from '../services/api'

function BranchPerformance() {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getBranchPerformance()
        setBranches(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  if (loading) return <div className='loading'></div>

  return (
    <div className='dashboard'>
      <h3 className='title'>Branch Performance</h3>
      <div className='title-underline'></div>

      {branches.length === 0 ? (
        <div className='empty-state'>
          <h4>No Branch Data</h4>
          <p>No partner branch performance available yet.</p>
        </div>
      ) : (
        <div className='items-grid'>
          {branches.map((branch) => (
            <div key={branch.partnerId} className='item-card'>
              <h4>{branch.partnerName}</h4>
              <p>{branch.branch}</p>
              <small>{branch.address}</small>

              <div className='details-info'>
                <p>
                  <strong>Total Items:</strong> {branch.totalItems}
                </p>
                <p>
                  <strong>Matched:</strong> {branch.matchedItems}
                </p>
                <p>
                  <strong>Recovered:</strong> {branch.recoveredItems}
                </p>
                <p>
                  <strong>Closed:</strong> {branch.closedCases}
                </p>
                <p>
                  <strong>Recovery Rate:</strong>{' '}
                  {branch.recoveryRate.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BranchPerformance
