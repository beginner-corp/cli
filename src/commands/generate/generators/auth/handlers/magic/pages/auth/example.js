module.exports = function () {
  return `export default function ({ html, state }) {
  const user = state?.store?.account?.user
  return html\` 
  <form action=/auth/logout method=POST>
    <button>Logout</button>
  </form>
  <p>You are logged in with \${user?.email}.</p>
  <p>You are \${state.store.admin ? '' : 'not'} an Admin</p>\`
}
`
}
