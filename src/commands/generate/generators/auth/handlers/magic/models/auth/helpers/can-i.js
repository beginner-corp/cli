module.exports = function () {
  return `export default function (req, operation) {
  const { session = {} } = req
  const account = session.account
  const userRoles = Object.values(account?.user?.roles || {} )
  const userPermissions = account?.permissions

  if (operation === 'auth' || operation === 'authenticate' || !operation) {
    return session?.account
  }

  const keys = Object.keys(operation)
  if (keys?.length === 1 && keys[0] === 'role' && userRoles?.includes(operation.role)) {
    return session?.account
  }

  return false
  
}
`
}
