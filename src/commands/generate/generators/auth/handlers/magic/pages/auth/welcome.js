module.exports = function () {
  return `export default function ({ html, state }) {
  const user = state?.store?.account?.user
  return html\`<p>Welcome New User \${user?.email} you are Logged In.</p>\`
}
`
}
