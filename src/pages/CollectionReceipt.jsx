import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  createReceipt,
  downloadReceiptPDF,
  getReceipt,
} from '../services/api'

function CollectionReceipt() {
  const { itemId } = useParams()
  const navigate = useNavigate()

  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [receiptMissing, setReceiptMissing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [form, setForm] = useState({
    collectedBy: '',
    signature: '',
    notes: '',
  })

  const handleCreateReceipt = async (e) => {
    e.preventDefault()

    try {
      setCreating(true)
      setError('')

      await createReceipt(itemId, form)
      const data = await getReceipt(itemId)

      setReceipt(data)
      setReceiptMissing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true)
      setError('')

      const blob = await downloadReceiptPDF(itemId)

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')

      link.href = url
      link.download = `${receipt.receiptNumber}.pdf`
      link.style.display = 'none'

      document.body.appendChild(link)

      link.click()

      link.remove()

      // Firefox may cancel a blob download when its URL is revoked in the
      // same event loop tick as the synthetic click.
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000)
    } catch (err) {
      setError(err.message || 'Failed to download receipt PDF')
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
        if (err.message === 'Receipt not found') {
          setReceiptMissing(true)
        } else {
          setError(err.message)
        }
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
    return (
      <div className='dashboard-loading' role='status'>
        <div className='loading'></div>
        <p>Loading collection receipt…</p>
      </div>
    )
  }

  if (receiptMissing) {
    return (
      <div className='receipt-create-page'>
      <form className='receipt-create-card' onSubmit={handleCreateReceipt}>
        <p className='dashboard-section-eyebrow'>Final handover record</p>
        <h1>Create Collection Receipt</h1>

        <p className='receipt-create-intro'>Record who collected the property. This permanent receipt can be printed, downloaded, and independently verified.</p>

        {error && <p className='form-alert'>{error}</p>}

        <div className='form-row'>
          <label className='form-label' htmlFor='collectedBy'>Collected By</label>
          <input
            id='collectedBy'
            type='text'
            className='form-input'
            value={form.collectedBy}
            onChange={(e) =>
              setForm({ ...form, collectedBy: e.target.value })
            }
            required
          />
        </div>

        <div className='form-row'>
          <label className='form-label' htmlFor='signature'>Signature or Reference <span>(optional)</span></label>
          <input
            id='signature'
            type='text'
            className='form-input'
            value={form.signature}
            onChange={(e) => setForm({ ...form, signature: e.target.value })}
          />
        </div>

        <div className='form-row'>
          <label className='form-label' htmlFor='collectionNotes'>Collection Notes <span>(optional)</span></label>
          <textarea
            id='collectionNotes'
            className='form-textarea'
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className='receipt-create-actions'>
          <button type='submit' className='btn' disabled={creating}>
            {creating ? 'Creating Receipt…' : 'Create Collection Receipt'}
          </button>
          <button type='button' className='btn btn-hipster' onClick={() => navigate(-1)} disabled={creating}>Go Back</button>
        </div>
      </form>
      </div>
    )
  }

  if (error || !receipt) {
    return (
      <div className='empty-state receipt-error-state'>
        <h2>Collection Receipt Unavailable</h2>
        <p>{error || 'We could not find a receipt for this item.'}</p>

        <button type='button' className='btn' onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    )
  }

  const identityDocument = getDocumentDetails()

  const ownerName = [
    ...(receipt.owner?.firstNames || []),
    receipt.owner?.surname,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className='receipt-page'>
      <div className='receipt-actions no-print'>
        <button type='button' className='btn btn-hipster' onClick={() => navigate(-1)}>
          ← Back
        </button>

        <button type='button' className='btn btn-hipster' onClick={() => window.print()}>
          Print Receipt
        </button>

        <button
          className='btn btn-primary'
          type='button'
          onClick={handleDownloadPDF}
          disabled={downloading}
        >
          {downloading ? 'Generating PDF…' : 'Download PDF'}
        </button>
      </div>

      {error && <p className='form-alert no-print'>{error}</p>}

      <div className='receipt'>
        {/* Header */}
        <div className='receipt-header'>
          <div>
            <h1>BACK 2 OWNER</h1>
            <p>Lost Property Management</p>
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
              <span className='receipt-label'>{identityDocument.type}</span>
              <strong>{maskDocument(identityDocument.number)}</strong>
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

          <strong>Back 2 Owner</strong>

          <small>Receipt generated electronically.</small>
        </div>
      </div>
    </div>
  )
}

export default CollectionReceipt
