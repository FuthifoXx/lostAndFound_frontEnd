export const getRoleHome = (role) => {
  if (role === 'admin') return '/admin'
  if (role === 'partner') return '/partner'
  return '/dashboard'
}
