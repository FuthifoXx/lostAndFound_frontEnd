import { useEffect, useState } from 'react'
import { getNotifications } from '../services/api'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications()
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
    <div className='dashboard'>
      <h3 className='title'>Notifications</h3>

      <div className='title-underline'></div>

      {notifications.length === 0 ? (
        <p className='text'>No notifications yet</p>
      ) : (
        <div className='items-grid'>
          {notifications.map((note) => (
            <div key={note._id} className='item-card'>
              <h4>{note.type.replace('_', ' ')}</h4>

              <p>{note.message}</p>

              <small>{new Date(note.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
