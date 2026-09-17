import { useEffect, useState } from 'react'
import { getAllUsers, updateUserById, deleteUserById } from '../services/api'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { useAuth } from '../hooks/useAuth'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const { user: currentUser } = useAuth()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setFeedback({ type: '', message: '' })
        const data = await getAllUsers()
        setUsers(data)
      } catch (err) {
        setFeedback({ type: 'error', message: err.message || 'Users could not be loaded.' })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleRoleChange = async (id, role) => {
    try {
      setProcessingId(id)
      setFeedback({ type: '', message: '' })

      const updatedUser = await updateUserById(id, { role })

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, role: updatedUser.role } : user,
        ),
      )
      setFeedback({ type: 'success', message: 'User role updated successfully.' })
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'The user role could not be updated.' })
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (id) => {
    try {
      setProcessingId(id)
      setFeedback({ type: '', message: '' })

      await deleteUserById(id)

      setUsers((prev) => prev.filter((user) => user._id !== id))
      setConfirmDeleteId(null)
      setFeedback({ type: 'success', message: 'User deleted successfully.' })
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'The user could not be deleted.' })
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading user directory…</p>
      </div>
    )
  }

  const roleCounts = users.reduce((counts, registeredUser) => {
    counts[registeredUser.role] = (counts[registeredUser.role] || 0) + 1
    return counts
  }, {})

  const normalizedQuery = query.trim().toLowerCase()
  const filteredUsers = users.filter((registeredUser) => {
    const fullName = `${Array.isArray(registeredUser.firstNames) ? registeredUser.firstNames.join(' ') : registeredUser.firstNames || ''} ${registeredUser.surname || ''}`
    const partner = registeredUser.partner ? `${registeredUser.partner.name} ${registeredUser.partner.branch}` : ''
    const matchesQuery = !normalizedQuery || `${registeredUser.email} ${fullName} ${registeredUser.phone || ''} ${partner}`.toLowerCase().includes(normalizedQuery)
    return matchesQuery && (roleFilter === 'all' || registeredUser.role === roleFilter)
  })

  return (
    <div className='dashboard admin-users-page'>
      <PageHeader title='User Management' description='Search accounts, manage access roles, and maintain the platform directory.' />

      <section className='stats-grid admin-user-stats' aria-label='User account summary'>
        <StatCard value={users.length} label='Total accounts' />
        <StatCard value={roleCounts.user || 0} label='Users' />
        <StatCard value={roleCounts.partner || 0} label='Partner users' />
        <StatCard value={roleCounts.admin || 0} label='Administrators' />
      </section>

      {feedback.message && <p className={`form-alert admin-user-feedback ${feedback.type === 'success' ? 'alert-success' : ''}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}

      {users.length > 0 && (
        <section className='admin-user-controls' aria-label='Filter user directory'>
          <div className='admin-user-search'>
            <label className='form-label' htmlFor='userSearch'>Search directory</label>
            <input id='userSearch' className='form-input' type='search' placeholder='Name, email, phone, or partner' value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div>
            <label className='form-label' htmlFor='roleFilter'>Role</label>
            <select id='roleFilter' className='form-input' value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value='all'>All roles</option>
              <option value='user'>Users</option>
              <option value='partner'>Partner users</option>
              <option value='admin'>Administrators</option>
            </select>
          </div>
          <p><strong>{filteredUsers.length}</strong> {filteredUsers.length === 1 ? 'account' : 'accounts'} shown</p>
        </section>
      )}

      {users.length === 0 ? (
        <EmptyState title='No users found' description='Registered users will appear here.' />
      ) : filteredUsers.length === 0 ? (
        <EmptyState title='No matching accounts' description='Try another search term or role filter.' />
      ) : (
        <div className='admin-user-grid'>
          {filteredUsers.map((registeredUser) => {
            const isCurrentUser = registeredUser._id === currentUser?._id || registeredUser.email === currentUser?.email
            const fullName = `${Array.isArray(registeredUser.firstNames) ? registeredUser.firstNames.join(' ') : registeredUser.firstNames || ''} ${registeredUser.surname || ''}`.trim()

            return <article key={registeredUser._id} className='admin-user-card'>
              <div className='admin-user-card-heading'>
                <div className='admin-user-avatar' aria-hidden='true'>{(fullName || registeredUser.email).charAt(0).toUpperCase()}</div>
                <div><h2>{fullName || 'Unnamed account'}</h2><p>{registeredUser.email}</p></div>
                <span className={`admin-role-badge role-${registeredUser.role}`}>{registeredUser.role}</span>
              </div>

              <dl className='admin-user-details'>
                <div><dt>Phone</dt><dd>{registeredUser.phone || 'Not provided'}</dd></div>
                <div><dt>Partner</dt><dd>{registeredUser.partner ? `${registeredUser.partner.name} — ${registeredUser.partner.branch}` : 'Not assigned'}</dd></div>
              </dl>

              <div className='admin-user-role-control'>
                <label className='form-label' htmlFor={`role-${registeredUser._id}`}>Account role</label>
                <select id={`role-${registeredUser._id}`} className='form-input' value={registeredUser.role} disabled={processingId === registeredUser._id || isCurrentUser} onChange={(event) => handleRoleChange(registeredUser._id, event.target.value)}>
                  <option value='user'>User</option><option value='partner'>Partner</option><option value='admin'>Admin</option>
                </select>
                {isCurrentUser && <small>Signed-in administrator</small>}
              </div>

              <div className='admin-user-actions'>
                {confirmDeleteId === registeredUser._id ? (
                  <div className='admin-user-delete-confirm'>
                    <strong>Delete this account permanently?</strong>
                    <button className='btn delete-btn' disabled={processingId === registeredUser._id} onClick={() => handleDelete(registeredUser._id)}>{processingId === registeredUser._id ? 'Deleting…' : 'Confirm delete'}</button>
                    <button className='btn btn-hipster' disabled={processingId === registeredUser._id} onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                  </div>
                ) : (
                  <button className='btn btn-hipster admin-user-delete-trigger' disabled={isCurrentUser} onClick={() => setConfirmDeleteId(registeredUser._id)}>Delete account</button>
                )}
              </div>
            </article>
          })}
        </div>
      )}
    </div>
  )
}

export default AdminUsers
