module.exports = function () {
  return `import db from '@begin/data'
import { getUsers } from '../../../models/users.mjs'
import { getRoles } from '../../../models/roles.mjs'

export async function get (req){
  const token = req.query?.token
  const verifySession = await db.get({ table: 'session', key: token })

  const { sessionToken, linkUsed = false } = verifySession
  let sessionInfo
  if (sessionToken && !linkUsed) {
    await db.set({ table: 'session', key: token, linkUsed: true })
    sessionInfo = await db.get({ table: 'session', key: sessionToken })

    if (sessionInfo?.newRegistration) {
      return {
        session: { redirectAfterAuth: sessionInfo?.redirectAfterAuth, verifiedEmail: sessionInfo?.email },
        location: '/auth/register'
      }
    }
    let users, user, roles, permissions
    try {
      users = await getUsers()
      user = users.find(i => i.email === sessionInfo.email)
      roles = await getRoles()
      permissions = Object.values(user?.roles).filter(Boolean).map(role => roles.find(i => role === i.name))
    }
    catch (e) {
      console.log(e)
    }

    if (user) {
      // Verified User
      return {
        session: { account: { user, permissions } },
        location: sessionInfo?.redirectAfterAuth
      }
    }
  }
  else if (sessionToken && linkUsed){
    return {
      // Link already used
      location: '/auth/login'
    }
  }
  return {
    location: '/auth/login'
  }
}

`
}
