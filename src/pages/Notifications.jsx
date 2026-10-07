import { useEffect, useState } from 'react'
import { getNotifications } from '../services/api'
import EmptyState from '../components/EmptyState'
import ItemCard from '../components/ItemCard'
import PageHeader from '../components/PageHeader'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setError('')
        const data = await getNotifications()
        setNotifications(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading your notifications…</p>
      </div>
    )
  }

  const sortedNotifications = [...notifications].sort(
    (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
  )

  return (
    <div className='dashboard notifications-page'>
      <PageHeader
        title='Notifications'
        description='Updates about matches, claims and item recovery activity.'
      />

      <section className='notifications-summary' aria-label='Notification inbox summary'>
        <strong>{notifications.length}</strong>
        <div>
          <h2>{notifications.length === 1 ? 'Recovery update' : 'Recovery updates'}</h2>
          <p>Delivery badges cover email, SMS and WhatsApp. Accepted means the provider accepted the message, not confirmed inbox delivery. Your in-app update remains available here.</p>
        </div>
      </section>

      {error ? (
        <EmptyState
          icon='!'
          title='Notifications could not be loaded'
          description={error}
        >
          <button type='button' className='btn btn-hipster' onClick={() => window.location.reload()}>
            Try again
          </button>
        </EmptyState>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon='✓'
          title='No notifications'
          description='You are all caught up. New matches and claim updates will appear here.'
        />
      ) : (
        <div className='items-grid notification-grid'>
          {sortedNotifications.map((note) => {
            const title = note.type
              ? note.type.replaceAll('_', ' ')
              : 'Notification'
            const channel = ({ EMAIL: 'Email', SMS: 'SMS', WHATSAPP: 'WhatsApp' })[note.channel] || note.channel || 'In-app'
            const deliveryLabel = !note.channel
              ? 'In-app update'
              : note.status === 'failed'
              ? `${channel} send unconfirmed`
              : note.status === 'sent'
                ? `${channel} accepted`
                : `${channel} pending`

            const notificationItem = {
              name: title,
              description: note.message,
            }

            return (
              <ItemCard
                key={note._id}
                item={notificationItem}
                showImage={false}
                status={null}
                badges={
                  [
                    {
                      status: note.status || 'pending',
                      label: deliveryLabel,
                    },
                    ...(note.item?.status
                      ? [
                        {
                          status: note.item.status,
                          label: `Current item status: ${note.item.status}`,
                        },
                      ]
                      : []),
                  ]
                }
                footer={
                  <>
                    <span>{channel}</span>
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
