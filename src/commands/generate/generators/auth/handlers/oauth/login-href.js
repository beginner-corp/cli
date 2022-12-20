module.exports = function (){
  return `
import arc from '@architect/functions'
const services = await arc.services()
const config = JSON.parse(services.oauth.config)
export default function  (req) {
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
`
}
