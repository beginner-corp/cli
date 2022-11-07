module.exports = function () {
  return `import {checkRole} from '../models/auth/auth-check.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function get (req) {
  const account = checkRole(req)
  const admin = checkRole(req, 'admin' )
  if (account) {
    return {
      json: { account, admin  }
    }
  }
  else {
    return {
      session: { redirectAfterAuth: '/auth-example' },
      location: '/login'
    }
  }
}
`
}
