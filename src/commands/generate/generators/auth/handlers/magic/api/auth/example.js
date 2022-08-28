module.exports = function () {
  return `import canI from '../../../models/auth/helpers/can-i.mjs'

export async function get (req) {
  const authenticated = canI(req, 'auth')
   const canAdmin = canI(req, { role: 'admin' })
  const canEditPosts = canI(req, { action: 'read', target: 'posts', owner: 'SELF' })
  if (authenticated) {
    return {
     json: { account: authenticated, canAdmin, canEditPosts  }
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
