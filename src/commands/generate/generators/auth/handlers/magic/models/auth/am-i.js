module.exports = function () {
  return `export default function (req, role) {
  const { session = {} } = req
  const account = session.account
  const userRoles = Object.values(account?.user?.roles || {} )

  if (userRoles?.includes(role)) {
    return true
  }
  return false
}
`
}
