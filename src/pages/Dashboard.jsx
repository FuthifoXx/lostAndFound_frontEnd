import { useEffect } from 'react'
import { getMyItems } from '../services/api'

function Dashboard() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyItems()
        console.log('MY ITEMS:', data)
      } catch (err) {
        console.log('ERROR:', err.message)
      }
    }

    fetchData()
  }, [])

  return <h2>Dashboard</h2>
}

export default Dashboard
