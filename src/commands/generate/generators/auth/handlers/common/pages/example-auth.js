module.exports = function () {
  return `/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function ({ html, state }) {
  const account = state?.store?.account
  return html\`
  <form action=/logout method=POST>
    <button>Logout</button>
  </form>
  <p>You are logged in with \${account?.email}.</p>
  <p>You are \${state.store.admin ? '' : 'not'} an Admin</p>\`
}
`
}
