module.exports = function () {
  return `export default function ({ html, state }) {
  const user = state?.store?.account?.user
  return html\`<p>You are logged in with \${user?.email}.</p>\`
}
`
}
