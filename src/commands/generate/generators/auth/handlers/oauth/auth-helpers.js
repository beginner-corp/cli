module.exports = function (){
  return `
import arc from '@architect/functions'
const services = await arc.services()
const config = JSON.parse(services.oauth.config)
export function  loginHref (req) {
  const redirectAfterAuth = req?.session?.redirectAfterAuth

  const redirectUrlPart = config.ARC_OAUTH_REDIRECT_URL
    ? \`&redirect_uri=\${config.ARC_OAUTH_REDIRECT_URL}\`
    : ''
  if (config.ARC_OAUTH_USE_MOCK)
    return \`http://localhost:3333/mock/auth/login\${
      redirectAfterAuth
        ? \`?state=\${encodeURIComponent(
          JSON.stringify({ redirectAfterAuth })
        )}\`
        : ''
    }\`
  else
    return \`https://github.com/login/oauth/authorize?client_id=\${
      process.env.ARC_OAUTH_CLIENT_ID
    }\${redirectUrlPart}\${
      redirectAfterAuth
        ? \`&state=\${encodeURIComponent(
          JSON.stringify({ redirectAfterAuth })
        )}\`
        : ''
    }\`
}
export function checkAuth (req) {
  return req?.session?.account
}
export function authRedirect (redirect) {
  return function (req) {
    return authenticate(req, redirect)
  }
}
export function auth (req) {
  return authenticate(req, false)
}

function authenticate (req, redirect) {
  const unAuthRedirect = config.ARC_OAUTH_UN_AUTH_REDIRECT || '/login'
  function isJSON (req) {
    let contentType = req.headers['Content-Type'] || req.headers['content-type']
    return /application\\/json/gi.test(contentType)
  }
  const account = req?.session?.account

  if (!account) {
    if (isJSON(req)) {
      return {
        statusCode: 401
      }
    }
    else {
      return {
        statusCode: 302,
        headers: {
          'cache-control':
            'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
        },
        location: redirect ? redirect : unAuthRedirect
      }
    }
  }
  else {
    return false
  }
}
`
}
