module.exports = function () {
  return `import authCheck from '../../node_modules/@architect/views/models/auth/auth-check.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function get (req) {
  const account = authCheck(req)
  const admin = authCheck(req, 'admin' )
  if (account) {
    return {
      json: { account, admin  }
    }
  }
  else {
    return {
      session: { redirectAfterAuth: '/auth/example' },
      location: '/auth/login'
    }
  }
}
`
}
