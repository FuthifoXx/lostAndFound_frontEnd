import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getReceipt } from '../services/api'

function CollectionReceipt() {
  const { itemId } = useParams()

  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const data = await getReceipt(itemId)
        setReceipt(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReceipt()
  }, [itemId])

  if (loading) return <div className='loading'></div>

  if (!receipt) {
    return (
      <div className='empty-state'>
        <h3>Receipt Not Found</h3>
        <p>No collection receipt exists for this item.</p>
      </div>
    )
  }

  return (
    <div className='dashboard'>
      <div className='receipt-card'>
        <div className='receipt-header'>
          <h2>Back2Owner</h2>
          <h4>Collection Receipt</h4>
        </div>

        <div className='receipt-section'>
          <p>
            <strong>Receipt No:</strong> {receipt._id}
          </p>

          <p>
            <strong>Collected At:</strong>{' '}
            {new Date(receipt.collectedAt).toLocaleString()}
          </p>
        </div>

        <hr />

        <div className='receipt-section'>
          <p>
            <strong>Collected By:</strong> {receipt.collectedBy}
          </p>

          <p>
            <strong>ID Number:</strong> {receipt.idNumber}
          </p>

          <p>
            <strong>Signature:</strong> {receipt.signature}
          </p>
        </div>

        <hr />

        <div className='receipt-section'>
          <p>
            <strong>Notes</strong>
          </p>

          <p>{receipt.notes}</p>
        </div>

        <button className='btn btn-block' onClick={() => window.print()}>
          Print Receipt
        </button>
      </div>
    </div>
  )
}

export default CollectionReceipt
