export const formatCalendarDate = (value) => {
  if (!value) return ''

  const [year, month, day] = value.slice(0, 10).split('-').map(Number)

  return new Date(year, month - 1, day).toLocaleDateString()
}
