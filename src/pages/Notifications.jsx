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

  if (loading) return <div className='loading'></div>

  return (
    <div className='dashboard'>
      <h3 className='title'>Notifications</h3>
      <div className='title-underline'></div>

      {notifications.length === 0 ? (
        <div className='empty-state'>
          <h4>No Notifications</h4>
          <p>You are all caught up.</p>
        </div>
      ) : (
        <div className='items-grid'>
          {notifications.map((note) => (
            <div key={note._id} className='item-card'>
              <div className='item-header'>
                <h5>
                  {note.type ? note.type.replace('_', ' ') : 'Notification'}
                </h5>

                <span className={`status ${note.status || 'pending'}`}>
                  {note.status || 'pending'}
                </span>
              </div>

              <p className='item-desc'>{note.message}</p>

              {note.item && (
                <>
                  {note.item.image && (
                    <img
                      src={note.item.image}
                      alt={note.item.name}
                      className='item-img'
                    />
                  )}

                  <p>
                    <strong>Item:</strong> {note.item.name}
                  </p>

                  <p>
                    <strong>Location:</strong> {note.item.location}
                  </p>

                  <p>
                    <strong>Item Status:</strong>{' '}
                    <span className={`status ${note.item.status}`}>
                      {note.item.status}
                    </span>
                  </p>
                </>
              )}

              <div className='item-footer'>
                <small>{note.channel || 'APP'}</small>
                <small>{new Date(note.createdAt).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
