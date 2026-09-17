import StatusBadge from './StatusBadge'

function ItemCard({
  item,
  status = item.status,
  badges = [],
  children,
  footer,
  actions,
  protectImage = true,
  compact = false,
}) {
  return (
    <article className={`item-card${compact ? ' item-card-compact' : ''}`}>
      {item.image ? (
        <div className={`item-card-media${protectImage ? ' protected-media' : ''}`}>
          <img src={item.image} alt='' className='item-img' loading='lazy' />
          {protectImage && (
            <span className='media-privacy-label'>Protected document preview</span>
          )}
        </div>
      ) : (
        <div className='item-card-media item-card-media-empty'>
          <span>No image provided</span>
        </div>
      )}

      <div className='item-card-body'>
        <div className='item-header'>
          <h2>{item.name}</h2>
          <div className='item-badges'>
            {status && <StatusBadge status={status} />}
            {badges.map((badge) => (
              <StatusBadge
                key={`${badge.status}-${badge.label || ''}`}
                status={badge.status}
                label={badge.label}
              />
            ))}
          </div>
        </div>

        {item.description && <p className='item-desc'>{item.description}</p>}
        {children && <div className='item-meta'>{children}</div>}
        {footer && <div className='item-footer'>{footer}</div>}
        {actions && <div className='item-actions'>{actions}</div>}
      </div>
    </article>
  )
}

export default ItemCard
