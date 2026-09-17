import { useEffect, useState } from 'react'
import {
  getPartners,
  createPartner,
  verifyPartner,
  assignUserToPartner,
  getAllUsers,
} from '../services/api'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

function AdminPartners() {
  const [partners, setPartners] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [confirmVerifyId, setConfirmVerifyId] = useState(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const [form, setForm] = useState({
    name: '',
    branch: '',
    address: '',
    contact: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFeedback({ type: '', message: '' })
        const partnersData = await getPartners()
        const usersData = await getAllUsers()

        setPartners(partnersData)
        setUsers(usersData)
      } catch (err) {
        setFeedback({ type: 'error', message: err.message || 'Partner records could not be loaded.' })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleCreatePartner = async (e) => {
    e.preventDefault()

    try {
      setCreating(true)
      setFeedback({ type: '', message: '' })
      const newPartner = await createPartner(form)

      setPartners((prev) => [newPartner, ...prev])

      setForm({
        name: '',
        branch: '',
        address: '',
        contact: '',
      })
      setFeedback({ type: 'success', message: 'Partner created and added to the verification queue.' })
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'The partner could not be created.' })
    } finally {
      setCreating(false)
    }
  }

  const handleVerify = async (id) => {
    try {
      setProcessingId(id)
      setFeedback({ type: '', message: '' })

      const updatedPartner = await verifyPartner(id)

      setPartners((prev) =>
        prev.map((partner) => (partner._id === id ? updatedPartner : partner)),
      )
      setConfirmVerifyId(null)
      setFeedback({ type: 'success', message: 'Partner verified successfully.' })
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'The partner could not be verified.' })
    } finally {
      setProcessingId(null)
    }
  }

  const handleAssign = async (partnerId) => {
    const userId = selectedUsers[partnerId]

    if (!userId) return

    try {
      setProcessingId(partnerId)
      setFeedback({ type: '', message: '' })

      await assignUserToPartner(partnerId, userId)

      const usersData = await getAllUsers()
      setUsers(usersData)
      setSelectedUsers((current) => ({ ...current, [partnerId]: '' }))
      setFeedback({ type: 'success', message: 'User assigned to the partner successfully.' })
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'The user could not be assigned.' })
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading partner management…</p>
      </div>
    )
  }

  const assignableUsers = users.filter((user) => user.role !== 'admin' && !user.partner)
  const verifiedCount = partners.filter((partner) => partner.isVerified).length
  const pendingCount = partners.length - verifiedCount
  const assignedUsers = users.filter((user) => user.partner).length
  const normalizedQuery = query.trim().toLowerCase()
  const filteredPartners = partners.filter((partner) => {
    const matchesQuery = !normalizedQuery || `${partner.name} ${partner.branch} ${partner.address} ${partner.contact}`.toLowerCase().includes(normalizedQuery)
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'verified' ? partner.isVerified : !partner.isVerified)
    return matchesQuery && matchesStatus
  })

  return (
    <div className='dashboard partner-management-page'>
      <PageHeader title='Partner Management' description='Create collection partners, verify branches, and assign authorized staff accounts.' />

      <section className='stats-grid partner-management-stats' aria-label='Partner network summary'>
        <StatCard value={partners.length} label='Partner branches' />
        <StatCard value={verifiedCount} label='Verified' />
        <StatCard value={pendingCount} label='Awaiting verification' />
        <StatCard value={assignedUsers} label='Assigned staff' />
      </section>

      {feedback.message && <p className={`form-alert partner-management-feedback ${feedback.type === 'success' ? 'alert-success' : ''}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}

      <section className='partner-create-panel' aria-labelledby='create-partner-heading'>
        <div className='partner-create-intro'>
          <p className='dashboard-section-eyebrow'>Network onboarding</p>
          <h2 id='create-partner-heading'>Create a partner branch</h2>
          <p>Add the branch’s official collection details. New partners remain pending until an administrator verifies them.</p>
        </div>

      <form className='partner-create-form' onSubmit={handleCreatePartner}>

        <div className='form-row'>
          <label className='form-label' htmlFor='partnerName'>Partner name</label>
          <input
            id='partnerName'
            className='form-input'
            name='name'
            value={form.name}
            onChange={handleChange}
            placeholder='e.g. Shoprite'
            required
          />
        </div>

        <div className='form-row'>
          <label className='form-label' htmlFor='partnerBranch'>Branch</label>
          <input
            id='partnerBranch'
            className='form-input'
            name='branch'
            value={form.branch}
            onChange={handleChange}
            placeholder='e.g. Johannesburg CBD'
            required
          />
        </div>

        <div className='form-row'>
          <label className='form-label' htmlFor='partnerAddress'>Address</label>
          <input
            id='partnerAddress'
            className='form-input'
            name='address'
            value={form.address}
            onChange={handleChange}
            placeholder='e.g. 123 Main Street'
            required
          />
        </div>

        <div className='form-row'>
          <label className='form-label' htmlFor='partnerContact'>Contact</label>
          <input
            id='partnerContact'
            className='form-input'
            name='contact'
            value={form.contact}
            onChange={handleChange}
            placeholder='e.g. 0111234567'
            required
          />
        </div>

        <button className='btn btn-block' type='submit' disabled={creating}>
          {creating ? 'Creating partner…' : 'Create Partner'}
        </button>
      </form>
      </section>

      {partners.length > 0 && <section className='partner-directory-controls' aria-label='Filter partner directory'>
        <div><label className='form-label' htmlFor='partnerSearch'>Search partners</label><input id='partnerSearch' className='form-input' type='search' placeholder='Name, branch, address, or contact' value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <div><label className='form-label' htmlFor='partnerStatus'>Verification</label><select id='partnerStatus' className='form-input' value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value='all'>All partners</option><option value='verified'>Verified</option><option value='pending'>Awaiting verification</option></select></div>
        <p><strong>{filteredPartners.length}</strong> {filteredPartners.length === 1 ? 'branch' : 'branches'} shown</p>
      </section>}

      {partners.length === 0 ? (
        <EmptyState title='No partners found' description='Created partner branches will appear here.' />
      ) : filteredPartners.length === 0 ? (
        <EmptyState title='No matching partners' description='Try another search term or verification filter.' />
      ) : (
        <div className='partner-directory-grid'>
          {filteredPartners.map((partner) => {
            const partnerUsers = users.filter((user) => (user.partner?._id || user.partner) === partner._id)

            return <article key={partner._id} className='partner-directory-card'>
              <div className='partner-directory-heading'>
                <div><h2>{partner.name}</h2><p>{partner.branch}</p></div>
                <span className={`status status-${partner.isVerified ? 'approved' : 'pending'}`}>{partner.isVerified ? 'Verified' : 'Pending'}</span>
              </div>

              <dl className='partner-directory-details'>
                <div><dt>Address</dt><dd>{partner.address}</dd></div>
                <div><dt>Contact</dt><dd>{partner.contact}</dd></div>
              </dl>

              {!partner.isVerified && (confirmVerifyId === partner._id ? <div className='partner-verify-confirm'><strong>Verify this collection partner?</strong><button className='btn' disabled={processingId === partner._id} onClick={() => handleVerify(partner._id)}>{processingId === partner._id ? 'Verifying…' : 'Confirm Verification'}</button><button className='btn btn-hipster' disabled={processingId === partner._id} onClick={() => setConfirmVerifyId(null)}>Cancel</button></div> : <button className='btn partner-verify-button' onClick={() => setConfirmVerifyId(partner._id)}>Verify Partner</button>)}

              <section className='partner-staff' aria-label={`Staff assigned to ${partner.name} ${partner.branch}`}>
                <div className='partner-staff-heading'><h3>Assigned staff</h3><span>{partnerUsers.length}</span></div>
                {partnerUsers.length > 0 ? <ul>{partnerUsers.map((user) => <li key={user._id}>{user.email}</li>)}</ul> : <p>No staff accounts assigned.</p>}
              </section>

              <div className='partner-assign-control'>
                <label className='form-label' htmlFor={`assign-${partner._id}`}>Assign an unassigned user</label>
                <select id={`assign-${partner._id}`} className='form-input' value={selectedUsers[partner._id] || ''} disabled={processingId === partner._id || assignableUsers.length === 0} onChange={(event) => setSelectedUsers({ ...selectedUsers, [partner._id]: event.target.value })}>
                  <option value=''>{assignableUsers.length === 0 ? 'No unassigned users available' : 'Select user'}</option>
                  {assignableUsers.map((user) => <option key={user._id} value={user._id}>{user.email} — {user.role}</option>)}
                </select>
                <button className='btn btn-hipster' disabled={processingId === partner._id || !selectedUsers[partner._id]} onClick={() => handleAssign(partner._id)}>{processingId === partner._id ? 'Assigning…' : 'Assign to Partner'}</button>
              </div>
            </article>
          })}
        </div>
      )}
    </div>
  )
}

export default AdminPartners
