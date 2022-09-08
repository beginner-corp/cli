module.exports = function () {
  return `import canI from '../../../models/auth/can-i.mjs'
import amI from '../../../models/auth/am-i.mjs'
import whoAmI from '../../../models/auth/who-am-i.mjs'

export async function get (req) {
  const account = whoAmI(req)
  const admin = amI(req, 'admin' )
  const canEditMyTasks = canI(req, { action: 'update', target: 'tasks', owner: 'SELF' })
  const canEditUsers = canI(req, { action: 'update', target: 'users', owner: 'ALL' })
  if (account) {
    return {
      json: { account, admin, canEditMyTasks, canEditUsers  }
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
