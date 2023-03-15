
export default async function authorize(providerAccount,config) {
  const useMock = config.ARC_OAUTH_USE_MOCK
  const useAllowList = config.ARC_OAUTH_USE_ALLOW_LIST
  const matchProperty = config.ARC_OAUTH_MATCH_PROPERTY
  let allowListPromise
  if (useAllowList && useMock)
    allowListPromise = import(
      '@architect/views/' + config.ARC_OAUTH_MOCK_ALLOW_LIST
    )
  if (useAllowList && !useMock)
    allowListPromise = import( 
      '@architect/views/' + config.ARC_OAUTH_ALLOW_LIST
    )

  const allowList = (await allowListPromise).default
  const appUser =
    allowList.appAccounts[providerAccount.oauth.user[matchProperty]]
  if (!appUser) return false
  return appUser
}
