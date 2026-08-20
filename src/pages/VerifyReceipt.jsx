import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { verifyReceipt } from '../services/api'

function VerifyReceipt() {
  const { receiptNumber } = useParams()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await verifyReceipt(receiptNumber)
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [receiptNumber])

  if (loading) {
    return (
      <div className='verification-page'>
        <div className='verification-card'>
          <div className='loading'></div>
          <p>Verifying receipt...</p>
        </div>
      </div>
    )
  }

  if (error || !data?.verified) {
    return (
      <div className='verification-page'>
        <div className='verification-card verification-failed'>
          <div className='verification-icon'>✕</div>

          <h2>Receipt Not Verified</h2>

          <p>We could not verify this collection receipt.</p>

          <small>Receipt Number: {receiptNumber}</small>

          <p className='verification-warning'>
            Please contact the Lost & Found office if you believe this receipt
            should be valid.
          </p>
        </div>
      </div>
    )
  }

  const { receipt } = data

  const firstNames = receipt.owner?.firstNames || []
  const surname = receipt.owner?.surname || ''

  const fullName = [...firstNames, surname].filter(Boolean).join(' ')

  // Mask the owner's name for public verification
  const maskedName = fullName
    ? fullName
        .split(' ')
        .map((name) => {
          if (!name) return ''
          return `${name.charAt(0)}${'*'.repeat(Math.max(name.length - 1, 1))}`
        })
        .join(' ')
    : 'Not available'

  const collectedDate = receipt.collectedAt
    ? new Date(receipt.collectedAt).toLocaleString()
    : 'Not available'

  return (
    <div className='verification-page'>
      <div className='verification-card verification-success'>
        <div className='verification-header'>
          <h1>LOST & FOUND</h1>
          <p>Management System</p>
        </div>

        <div className='verification-icon'>✓</div>

        <h2>Receipt Verified</h2>

        <p className='verification-message'>
          This collection receipt has been successfully verified.
        </p>

        <div className='verification-status'>
          <span>✓ Authentic Receipt</span>
        </div>

        <div className='verification-details'>
          <div className='verification-row'>
            <span>Receipt Number</span>
            <strong>{receipt.receiptNumber}</strong>
          </div>

          <div className='verification-row'>
            <span>Owner</span>
            <strong>{maskedName}</strong>
          </div>

          <div className='verification-row'>
            <span>Item</span>
            <strong>{receipt.item?.name || 'Not available'}</strong>
          </div>

          <div className='verification-row'>
            <span>Description</span>
            <strong>{receipt.item?.description || 'Not available'}</strong>
          </div>

          <div className='verification-row'>
            <span>Partner</span>
            <strong>{receipt.partner?.name || 'Not available'}</strong>
          </div>

          <div className='verification-row'>
            <span>Branch</span>
            <strong>{receipt.partner?.branch || 'Not available'}</strong>
          </div>

          <div className='verification-row'>
            <span>Collected By</span>
            <strong>{receipt.collectedBy}</strong>
          </div>

          <div className='verification-row'>
            <span>Collection Date</span>
            <strong>{collectedDate}</strong>
          </div>
        </div>

        <div className='verification-footer'>
          <p>
            This verification confirms that the receipt exists in the Lost &
            Found system.
          </p>

          <small>
            No sensitive identity document information is displayed.
          </small>
        </div>
      </div>
    </div>
  )
}

export default VerifyReceipt
