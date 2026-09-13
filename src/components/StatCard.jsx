function StatCard({ value, label }) {
  return (
    <article className='stat-card'>
      <strong className='stat-value'>{value}</strong>
      <span className='stat-label'>{label}</span>
    </article>
  )
}

export default StatCard
