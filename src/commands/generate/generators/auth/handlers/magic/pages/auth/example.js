module.exports = function () {
  return `export default function ({ html, state }) {
  const user = state?.store?.account
  return html\`<p>It's like magic \${user?.email} is Logged In.</p>\`
}
`
}
