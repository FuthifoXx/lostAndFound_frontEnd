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
          <div className='empty-state'>
            <h4>No Notifications</h4>

            <p>You are all caught up</p>
          </div>
        ) : (
          <div className='items-grid'>
            {notifications.map((note) => (
              <div key={note._id} className='item-card'>
                <div className='item-header'>
                  <h4>{note.type}</h4>

                  <span className={`status ${note.status}`}>{note.status}</span>
                </div>

                <p className='item-desc'>{note.message}</p>

                {note.item?.image && (
                  <img
                    src={note.item.image}
                    alt={note.item.name}
                    className='item-img'
                  />
                )}

                <div className='item-footer'>
                  <small>{new Date(note.createdAt).toLocaleString()}</small>

                  <small>{note.channel}</small>
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
