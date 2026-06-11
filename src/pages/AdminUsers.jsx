import { useEffect, useState } from 'react'
import { getAllUsers, updateUserById, deleteUserById } from '../services/api'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers()
        setUsers(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleRoleChange = async (id, role) => {
    try {
      setProcessingId(id)

      const updatedUser = await updateUserById(id, { role })

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, role: updatedUser.role } : user,
        ),
      )
    } catch (err) {
      console.log(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?',
    )

    if (!confirmDelete) return

    try {
      setProcessingId(id)

      await deleteUserById(id)

      setUsers((prev) => prev.filter((user) => user._id !== id))
    } catch (err) {
      console.log(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <div className='loading'></div>

  return (
    <div className='dashboard'>
      <h3 className='title'>User Management</h3>
      <div className='title-underline'></div>

      {users.length === 0 ? (
        <div className='empty-state'>
          <h4>No Users Found</h4>
          <p>Registered users will appear here.</p>
        </div>
      ) : (
        <div className='items-grid'>
          {users.map((user) => (
            <div key={user._id} className='item-card'>
              <div className='item-header'>
                <h5>{user.email}</h5>
                <span className={`status ${user.role}`}>{user.role}</span>
              </div>

              <p>
                <strong>Name:</strong>{' '}
                {Array.isArray(user.firstNames)
                  ? user.firstNames.join(' ')
                  : user.firstNames}{' '}
                {user.surname}
              </p>

              <p>
                <strong>Phone:</strong> {user.phone || 'No phone'}
              </p>

              <p>
                <strong>Partner:</strong>{' '}
                {user.partner
                  ? `${user.partner.name} - ${user.partner.branch}`
                  : 'Not assigned'}
              </p>

              <div className='form-row' style={{ marginTop: '1rem' }}>
                <label className='form-label'>Role</label>

                <select
                  className='form-input'
                  value={user.role}
                  disabled={processingId === user._id}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value='user'>User</option>
                  <option value='partner'>Partner</option>
                  <option value='admin'>Admin</option>
                </select>
              </div>

              <div className='item-actions'>
                <button
                  className='btn delete-btn'
                  disabled={processingId === user._id}
                  onClick={() => handleDelete(user._id)}
                >
                  {processingId === user._id ? 'Processing...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminUsers
