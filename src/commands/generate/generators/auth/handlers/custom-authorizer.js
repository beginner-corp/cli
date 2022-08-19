module.exports = function () {
  return `/* Custom Authorizer Route
  If user accounts from allow.mjs list are not enough
  add the custom authorizer.
  1. Add custom auth route in .arc manifest
    @oauth
    custom-authorizer /custom-auth
  2. Add an app/api/custom-auth.mjs route

  The plugin calls this route with an oauth object on the session. Check this against allowed users (i.e. in database). Add an account key to the session and redirect to location: process.env.ARC_OAUTH_AFTER_AUTH.
  */



export async function get(req) {
  const providerAccount = req?.session?.oauth
  const session = req?.session
  let { redirectAfterAuth='', ...newSession={} } = session

  if (providerAccount) {
    const matchOn = process.env.ARC_OAUTH_MATCH_PROPERTY

    // read from database i.e. vvv
    //  import begin from '@begin/data'
    //  const data = await begin()
    //  const appUser = await data.get({table:'users',key:providerAccount.user[matchOn]})
    const userFakeDatabase = {
      janedoe: {
        role: 'member',
        name: 'Jane Doe'
      }
    }
    const appUser = userFakeDatabase?.[providerAccount.user[matchOn]]
    // ^^^ Database code here

    if (appUser) {
      newSession = {...newSession,account:appUser}
      return {
        session:newSession,
        location: redirectAfterAuth || process.env.ARC_OAUTH_AFTER_AUTH
      }
    }
    else {
      return {
        statusCode: 401,
        body: 'not authorized'
      }
    }
  }
  else {
    return {
      statusCode: 302,
      location: process.env.ARC_OAUTH_UN_AUTH_REDIRECT
    }
  }
}`
}
