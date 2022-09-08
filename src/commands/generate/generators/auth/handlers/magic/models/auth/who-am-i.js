module.exports = function () {
  return `export default function (req) {
  const { session = {} } = req
  const account = session?.account
  return account
}
`
}
