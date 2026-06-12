import { useEffect, useState } from 'react'
import {
  getPartners,
  createPartner,
  verifyPartner,
  assignUserToPartner,
  getAllUsers,
} from '../services/api'

function AdminPartners() {
  const [partners, setPartners] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    branch: '',
    address: '',
    contact: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const partnersData = await getPartners()
        const usersData = await getAllUsers()

        setPartners(partnersData)
        setUsers(usersData)
      } catch (err) {
        console.log(err.message)
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
      const newPartner = await createPartner(form)

      setPartners((prev) => [newPartner, ...prev])

      setForm({
        name: '',
        branch: '',
        address: '',
        contact: '',
      })
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleVerify = async (id) => {
    try {
      setProcessingId(id)

      const updatedPartner = await verifyPartner(id)

      setPartners((prev) =>
        prev.map((partner) => (partner._id === id ? updatedPartner : partner)),
      )
    } catch (err) {
      console.log(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  const handleAssign = async (partnerId) => {
    const userId = selectedUsers[partnerId]

    if (!userId) return

    try {
      setProcessingId(partnerId)

      await assignUserToPartner(partnerId, userId)

      const usersData = await getAllUsers()
      setUsers(usersData)
    } catch (err) {
      console.log(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <div className='loading'></div>

  const assignableUsers = users.filter((user) => user.role !== 'admin')

  return (
    <div className='dashboard'>
      <h3 className='title'>Partner Management</h3>
      <div className='title-underline'></div>

      <form className='form' onSubmit={handleCreatePartner}>
        <h4>Create Partner</h4>

        <div className='form-row'>
          <label className='form-label'>Partner Name</label>
          <input
            className='form-input'
            name='name'
            value={form.name}
            onChange={handleChange}
            placeholder='e.g. Shoprite'
          />
        </div>

        <div className='form-row'>
          <label className='form-label'>Branch</label>
          <input
            className='form-input'
            name='branch'
            value={form.branch}
            onChange={handleChange}
            placeholder='e.g. Johannesburg CBD'
          />
        </div>

        <div className='form-row'>
          <label className='form-label'>Address</label>
          <input
            className='form-input'
            name='address'
            value={form.address}
            onChange={handleChange}
            placeholder='e.g. 123 Main Street'
          />
        </div>

        <div className='form-row'>
          <label className='form-label'>Contact</label>
          <input
            className='form-input'
            name='contact'
            value={form.contact}
            onChange={handleChange}
            placeholder='e.g. 0111234567'
          />
        </div>

        <button className='btn btn-block' type='submit'>
          Create Partner
        </button>
      </form>

      {partners.length === 0 ? (
        <div className='empty-state'>
          <h4>No Partners Found</h4>
          <p>Created partners will appear here.</p>
        </div>
      ) : (
        <div className='items-grid'>
          {partners.map((partner) => (
            <div key={partner._id} className='item-card'>
              <div className='item-header'>
                <h5>{partner.name}</h5>
                <span
                  className={`status ${
                    partner.isVerified ? 'approved' : 'pending'
                  }`}
                >
                  {partner.isVerified ? 'verified' : 'pending'}
                </span>
              </div>

              <p>
                <strong>Branch:</strong> {partner.branch}
              </p>

              <p>
                <strong>Address:</strong> {partner.address}
              </p>

              <p>
                <strong>Contact:</strong> {partner.contact}
              </p>

              {!partner.isVerified && (
                <div className='item-actions'>
                  <button
                    className='btn'
                    disabled={processingId === partner._id}
                    onClick={() => handleVerify(partner._id)}
                  >
                    {processingId === partner._id
                      ? 'Processing...'
                      : 'Verify Partner'}
                  </button>
                </div>
              )}

              <div className='form-row' style={{ marginTop: '1rem' }}>
                <label className='form-label'>Assign User</label>

                <select
                  className='form-input'
                  value={selectedUsers[partner._id] || ''}
                  onChange={(e) =>
                    setSelectedUsers({
                      ...selectedUsers,
                      [partner._id]: e.target.value,
                    })
                  }
                >
                  <option value=''>Select user</option>

                  {assignableUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.email} - {user.role}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className='btn btn-hipster'
                disabled={processingId === partner._id}
                onClick={() => handleAssign(partner._id)}
              >
                {processingId === partner._id
                  ? 'Assigning...'
                  : 'Assign To Partner'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminPartners
