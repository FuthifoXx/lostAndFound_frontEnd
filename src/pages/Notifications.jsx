import { useEffect, useState } from 'react'
import { getNotifications } from '../services/api'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'

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
      <PageHeader
        title='Notifications'
        description='Updates about matches, claims and item recovery activity.'
      />

      {notifications.length === 0 ? (
        <EmptyState
          title='No notifications'
          description='You are all caught up.'
        />
      ) : (
        <div className='items-grid notification-grid'>
          {notifications.map((note) => {
            const title = note.type
              ? note.type.replaceAll('_', ' ')
              : 'Notification'

            const notificationItem = {
              name: title,
              description: note.message,
              image: note.item?.image,
            }

            return (
              <ItemCard
                key={note._id}
                item={notificationItem}
                status={note.status || 'pending'}
                badges={
                  note.item?.status
                    ? [
                        {
                          status: note.item.status,
                          label: `Item: ${note.item.status}`,
                        },
                      ]
                    : []
                }
                footer={
                  <>
                    <span>{note.channel || 'In-app'}</span>
                    <time dateTime={note.createdAt}>
                      {new Date(note.createdAt).toLocaleString()}
                    </time>
                  </>
                }
              >
                {note.item && (
                  <>
                    <p>
                      <strong>Item</strong>
                      <span>{note.item.name}</span>
                    </p>
                    <p>
                      <strong>Location</strong>
                      <span>{note.item.location}</span>
                    </p>
                  </>
                )}
              </ItemCard>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Notifications
