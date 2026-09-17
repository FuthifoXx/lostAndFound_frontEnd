function PageHeader({ title, description }) {
  return (
    <header className='page-header'>
      <h1>{title}</h1>
      <div className='title-underline' aria-hidden='true'></div>
      {description && <p>{description}</p>}
    </header>
  )
}

export default PageHeader
