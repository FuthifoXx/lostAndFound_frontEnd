import { useEffect, useState } from 'react'
import { getNotifications } from '../services/api'
import Navbar from '../components/Navbar'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications()

        console.log('NOTIFICATIONS:', data)

        setNotifications(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  if (loading) {
    return <div className='loading'></div>
  }

  return (
    <>
      <Navbar />

      <div className='dashboard'>
        <h3 className='title'>Notifications</h3>
        <div className='title-underline'></div>

        {notifications.length === 0 ? (
          <p className='text'>No notifications yet</p>
        ) : (
          <div className='items-grid'>
            {notifications.map((note) => (
              <div key={note._id} className='item-card'>
                <div className='item-header'>
                  <h5>{note.type.replace('_', ' ')}</h5>

                  <span className={`status ${note.status}`}>{note.status}</span>
                </div>

                <p className='item-desc'>{note.message}</p>

                <div className='item-footer'>
                  <small>{note.channel}</small>

                  <small>{new Date(note.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Notifications
