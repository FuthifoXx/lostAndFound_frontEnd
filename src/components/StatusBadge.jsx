const statusLabels = {
  none: 'No claim',
  pending: 'Pending',
  approved: 'Approved',
  matched: 'Matched',
  claimed: 'Claimed',
  recovered: 'Recovered',
  closed: 'Closed',
  rejected: 'Rejected',
  failed: 'Delivery failed',
  sent: 'Sent',
}

function StatusBadge({ status = 'none', label }) {
  const normalizedStatus = String(status).toLowerCase().replaceAll('_', '-')
  const accessibleLabel =
    label || statusLabels[normalizedStatus] || normalizedStatus.replaceAll('-', ' ')

  return (
    <span className={`status status-${normalizedStatus}`}>
      {accessibleLabel}
    </span>
  )
}

export default StatusBadge
