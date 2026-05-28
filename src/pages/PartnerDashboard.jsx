import { useEffect, useState } from 'react'
import { getPartnerItems } from '../services/api'
import Navbar from '../components/Navbar'

function PartnerDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

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
      <Navbar />

      <div className='dashboard'>
        <h3 className='title'>Partner Dashboard</h3>
        <div className='title-underline'></div>

        {items.length === 0 ? (
          <div className='empty-state'>
            <h4>No Uploaded Items</h4>
            <p>Your branch has not uploaded any items yet.</p>
          </div>
        ) : (
          <div className='items-grid'>
            {items.map((item) => (
              <div key={item._id} className='item-card'>
                {item.image && (
                  <img src={item.image} alt={item.name} className='item-img' />
                )}

                <div className='item-header'>
                  <h5>{item.name}</h5>
                  <span className={`status ${item.status}`}>{item.status}</span>
                </div>

                <p className='item-desc'>{item.description}</p>

                <p>
                  <strong>Location:</strong> {item.location}
                </p>

                <p>
                  <strong>Claim:</strong>{' '}
                  <span className={`status ${item.claimStatus}`}>
                    {item.claimStatus}
                  </span>
                </p>

                {item.matchedUser && (
                  <p>
                    <strong>Matched User:</strong> {item.matchedUser.email}
                  </p>
                )}

                <div className='item-footer'>
                  <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default PartnerDashboard
