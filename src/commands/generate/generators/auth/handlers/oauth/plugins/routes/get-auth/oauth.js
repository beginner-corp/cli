module.exports = function (){
  return /* javascript*/ `import tiny from 'tiny-json-http'

export default async function oauth(req,config) {
  const useMock = config.ARC_OAUTH_USE_MOCK
  const includeProperties = config.ARC_OAUTH_INCLUDE_PROPERTIES
  const data = {
    code: req.query.code
  }
  if (!useMock) {
    data.client_id = config.ARC_OAUTH_CLIENT_ID
    data.client_secret = config.ARC_OAUTH_CLIENT_SECRET
    data.redirect_uri = config.ARC_OAUTH_REDIRECT
  }
  let result = await tiny.post({
    url: config.ARC_OAUTH_TOKEN_URI,
    headers: { Accept: 'application/json' },
    data
  })
  let token = result.body.access_token
  let userResult = await tiny.get({
    url: config.ARC_OAUTH_USER_INFO_URI,
    headers: {
      Authorization: 'token ' + token,
      Accept: 'application/json'
    }
  })

  const providerUser = userResult.body
  const filteredDetails = {}
  includeProperties.forEach((i) => (filteredDetails[i] = providerUser[i]))
  return {
    oauth: { user: filteredDetails }
  }
}
`
}
