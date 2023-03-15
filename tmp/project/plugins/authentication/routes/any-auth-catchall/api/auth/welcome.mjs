import {checkAuth} from '../../node_modules/@architect/views/models/auth/auth-check.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function get (req) {
  const authenticated = checkAuth(req)
  if (authenticated) {
    return {
      json: { account: authenticated }
    }
  }
  else {
    return {
      location: '/'
    }
  }
}
