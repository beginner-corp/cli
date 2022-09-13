module.exports = function () {
  return `/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function ({ html, state }) {
  const user = state?.store?.account?.user
  return html\`<p>Welcome New User \${user?.email} you are Logged In.</p>\`
}
`
}
