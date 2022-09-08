module.exports = function () {
  return `import canI from '../../../models/auth/can-i.mjs'

export async function get (req) {
  const account = canI(req)
  const admin = canI(req, 'admin' )
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
