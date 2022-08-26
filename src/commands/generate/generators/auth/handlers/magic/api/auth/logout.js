module.exports = function () {
  return `
export async function post (req) {
  return {
    session: {},
    location: '/auth/signup'
  }
}
`
}
