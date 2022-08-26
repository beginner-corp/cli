module.exports = function () {
  return `export default function (req, operation) {
  const { session = {} } = req
  if (operation === 'auth') {
    return session?.account
  }
}
`
}
