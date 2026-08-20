import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getReceipt, downloadReceiptPDF } from '../services/api'

function CollectionReceipt() {
  const { itemId } = useParams()
  const navigate = useNavigate()

  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true)

      const blob = await downloadReceiptPDF(itemId)

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')

      link.href = url
      link.download = `${receipt.receiptNumber}.pdf`

      document.body.appendChild(link)

      link.click()

      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err.message)
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setError('')

        const data = await getReceipt(itemId)

        setReceipt(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReceipt()
  }, [itemId])

  const maskDocument = (value) => {
    if (!value) return 'Not provided'

    if (value.length <= 4) {
      return value
    }

    return `${'*'.repeat(value.length - 4)}${value.slice(-4)}`
  }

  const getDocumentDetails = () => {
    if (receipt.idNumber) {
      return {
        type: 'RSA ID Number',
        number: receipt.idNumber,
      }
    }

    if (receipt.passportNumber) {
      return {
        type: 'Passport Number',
        number: receipt.passportNumber,
      }
    }

    if (receipt.documentNumber) {
      return {
        type: 'Document Number',
        number: receipt.documentNumber,
      }
    }

    return {
      type: 'Identity Document',
      number: 'Not provided',
    }
  }

  if (loading) {
    return <div className='loading'></div>
  }

  if (error || !receipt) {
    return (
      <div className='empty-state'>
        <h4>Collection Receipt Unavailable</h4>
        <p>{error || 'We could not find a receipt for this item.'}</p>

        <button className='btn' onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    )
  }

  const document = getDocumentDetails()

  const ownerName = [
    ...(receipt.owner?.firstNames || []),
    receipt.owner?.surname,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className='receipt-page'>
      <div className='receipt-actions no-print'>
        <button className='btn' onClick={() => navigate(-1)}>
          ← Back
        </button>

        <button className='btn btn-primary' onClick={() => window.print()}>
          🖨 Print
        </button>

        <button
          className='btn btn-primary'
          onClick={handleDownloadPDF}
          disabled={downloading}
        >
          {downloading ? 'Generating PDF...' : '🧾 Download PDF'}
        </button>
      </div>

      <div className='receipt'>
        {/* Header */}
        <div className='receipt-header'>
          <div>
            <h1>LOST & FOUND</h1>
            <p>Management System</p>
          </div>

          <div className='receipt-title'>
            <h2>COLLECTION RECEIPT</h2>

            <p>
              Receipt No:
              <strong>{receipt.receiptNumber}</strong>
            </p>
          </div>
        </div>

        {/* Receipt status */}
        <div className='receipt-status'>
          <span>PROPERTY SUCCESSFULLY RELEASED</span>
        </div>

        {/* Owner */}
        <section className='receipt-section'>
          <h3>Owner Details</h3>

          <div className='receipt-grid'>
            <div>
              <span className='receipt-label'>Full Name</span>
              <strong>{ownerName || 'Not available'}</strong>
            </div>

            <div>
              <span className='receipt-label'>Email</span>
              <strong>{receipt.owner?.email || 'Not available'}</strong>
            </div>

            <div>
              <span className='receipt-label'>{document.type}</span>
              <strong>{maskDocument(document.number)}</strong>
            </div>
          </div>
        </section>

        {/* Item */}
        <section className='receipt-section'>
          <h3>Property Details</h3>

          <div className='receipt-grid'>
            <div>
              <span className='receipt-label'>Item</span>
              <strong>{receipt.item?.name || 'Not available'}</strong>
            </div>

            <div>
              <span className='receipt-label'>Description</span>
              <strong>{receipt.item?.description || 'Not available'}</strong>
            </div>

            <div>
              <span className='receipt-label'>Location</span>
              <strong>{receipt.item?.location || 'Not available'}</strong>
            </div>
          </div>

          {receipt.item?.image && (
            <div className='receipt-item-image'>
              <img src={receipt.item.image} alt={receipt.item.name} />
            </div>
          )}
        </section>

        {/* Partner */}
        <section className='receipt-section'>
          <h3>Collection Location</h3>

          <div className='receipt-grid'>
            <div>
              <span className='receipt-label'>Partner</span>
              <strong>{receipt.partner?.name || 'Not available'}</strong>
            </div>

            <div>
              <span className='receipt-label'>Branch</span>
              <strong>{receipt.partner?.branch || 'Not available'}</strong>
            </div>
          </div>
        </section>

        {/* Collection */}
        <section className='receipt-section'>
          <h3>Collection Details</h3>

          <div className='receipt-grid'>
            <div>
              <span className='receipt-label'>Collected By</span>
              <strong>{receipt.collectedBy}</strong>
            </div>

            <div>
              <span className='receipt-label'>Collection Date</span>
              <strong>
                {new Date(receipt.collectedAt).toLocaleDateString()}
              </strong>
            </div>

            <div>
              <span className='receipt-label'>Collection Time</span>
              <strong>
                {new Date(receipt.collectedAt).toLocaleTimeString()}
              </strong>
            </div>
          </div>
        </section>

        {/* Notes */}
        {receipt.notes && (
          <section className='receipt-section'>
            <h3>Collection Notes</h3>

            <div className='receipt-notes'>
              <p>{receipt.notes}</p>
            </div>
          </section>
        )}

        {/* Signature */}
        <section className='receipt-section'>
          <h3>Confirmation</h3>

          <p className='receipt-confirmation'>
            I confirm that the property described above has been released to me
            after verification of my identity.
          </p>

          <div className='signature-grid'>
            <div className='signature-box'>
              <div className='signature-line'>{receipt.signature || ''}</div>

              <span>Owner Signature</span>
            </div>

            <div className='signature-box'>
              <div className='signature-line'></div>

              <span>Partner Representative</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className='receipt-footer'>
          <p>
            This receipt serves as confirmation of the collection and release of
            the property described above.
          </p>

          <strong>Lost & Found Management System</strong>

          <small>Receipt generated electronically.</small>
        </div>
      </div>
    </div>
  )
}

export default CollectionReceipt
