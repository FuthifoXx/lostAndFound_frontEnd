import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getReceipt } from '../services/api'

function CollectionReceipt() {
  const { id } = useParams()

  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const data = await getReceipt(id)
        setReceipt(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReceipt()
  }, [id])

  if (loading) {
    return <div className='loading'></div>
  }

  if (!receipt) {
    return (
      <div className='empty-state'>
        <h4>Receipt Not Found</h4>
        <p>No collection receipt exists for this item.</p>
      </div>
    )
  }

  return (
    <div className='receipt-container'>
      <div className='receipt-card'>
        <div className='receipt-header'>
          <h1>Back2Owner</h1>
          <p>Lost & Found Collection Receipt</p>
        </div>

        <div className='receipt-divider'></div>

        <div className='receipt-row'>
          <strong>Receipt No:</strong>
          <span>{receipt._id.slice(-8).toUpperCase()}</span>
        </div>

        <div className='receipt-row'>
          <strong>Collection Date:</strong>
          <span>{new Date(receipt.collectedAt).toLocaleString()}</span>
        </div>

        <div className='receipt-divider'></div>

        <h3>Partner Information</h3>

        <div className='receipt-row'>
          <strong>Partner</strong>
          <span>{receipt.partner?.name}</span>
        </div>

        <div className='receipt-row'>
          <strong>Branch</strong>
          <span>{receipt.partner?.branch}</span>
        </div>

        <div className='receipt-divider'></div>

        <h3>Recovered Item</h3>

        {receipt.item?.image && (
          <img
            src={receipt.item.image}
            alt={receipt.item.name}
            className='receipt-image'
          />
        )}

        <div className='receipt-row'>
          <strong>Name</strong>
          <span>{receipt.item?.name}</span>
        </div>

        <div className='receipt-row'>
          <strong>Description</strong>
          <span>{receipt.item?.description}</span>
        </div>

        <div className='receipt-row'>
          <strong>Location</strong>
          <span>{receipt.item?.location}</span>
        </div>

        <div className='receipt-row'>
          <strong>Date Lost</strong>
          <span>{new Date(receipt.item?.dateLost).toLocaleDateString()}</span>
        </div>

        <div className='receipt-divider'></div>

        <h3>Owner Details</h3>

        <div className='receipt-row'>
          <strong>Name</strong>

          <span>
            {receipt.owner?.firstNames?.join(' ')} {receipt.owner?.surname}
          </span>
        </div>

        <div className='receipt-row'>
          <strong>Identity</strong>
          <span>{receipt.item?.identityType}</span>
        </div>

        <div className='receipt-divider'></div>

        <h3>Collection Details</h3>

        <div className='receipt-row'>
          <strong>Collected By</strong>
          <span>{receipt.collectedBy}</span>
        </div>

        <div className='receipt-row'>
          <strong>Owner Signature</strong>
          <span>{receipt.signature}</span>
        </div>

        <div className='receipt-divider'></div>

        <h3>Notes</h3>

        <div className='receipt-notes'>
          {receipt.notes || 'No additional notes.'}
        </div>

        <div className='receipt-divider'></div>

        <div className='receipt-footer'>
          <p>Thank you for using</p>

          <h2>Back2Owner</h2>

          <p>Reconnecting People With Their Property</p>
        </div>

        <button className='btn btn-block' onClick={() => window.print()}>
          🖨 Print Receipt
        </button>
      </div>
    </div>
  )
}

export default CollectionReceipt
