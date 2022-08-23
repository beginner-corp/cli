module.exports = function () {
  return `import arcOauth from 'arc-plugin-oauth'
const checkAuth = arcOauth.checkAuth

export async function get(req) {
    const authenticated = checkAuth(req)
    if (authenticated) {
      return {
        json: { data: ['fred', 'joe', 'mary'] }
      }
    } else {
      return {
        statusCode:401,
        json:{error:"not authorized"}
      }
    }
}`
}
