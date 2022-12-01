module.exports = function () {
  return /* javascript*/`import { checkAuth } from '../models/auth/auth-check.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function get (req) {
  const account = checkAuth(req)
  const admin = checkAuth(req, 'admin' )
  if (account) {
    return {
      json: { account, admin  }
    }
  }
  else {
    return {
      session: { redirectAfterAuth: '/example-auth' },
      location: '/login'
    }
  }
}
`
}
