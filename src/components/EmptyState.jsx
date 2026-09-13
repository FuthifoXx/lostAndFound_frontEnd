function EmptyState({ title, description, children }) {
  return (
    <section className='empty-state' aria-live='polite'>
      <div className='empty-state-icon' aria-hidden='true'>
        ✓
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {children && <div className='empty-state-action'>{children}</div>}
    </section>
  )
}

export default EmptyState
