module.exports = function () {
  return `export function checkRole (req, role) {
  const { session = {} } = req
  const account = session.account
  const accountRoles = Object.values(account?.account?.roles || {} )

  if (!role) {
    return account
  }
  else if (accountRoles?.includes(role)) {
    return true
  }
  else return false
}
