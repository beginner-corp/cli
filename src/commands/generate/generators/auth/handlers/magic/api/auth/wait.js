module.exports = function () {
  return `import arc from '@architect/functions'
import db from '@begin/data'
import { getUsers } from '../../../models/users.mjs'
import { getRoles } from '../../../models/roles.mjs'
let wsScriptUrl = arc.static('bundles/magic-ws.mjs')
let wsUrl = getWS()

export async function get (req) {
  const magicQueryId = req.query?.magic
  const session = req?.session
  const { redirectAfterAuth = '/', signingUp = false, ...newSession } = session
  let sessionInfo
  try {
    sessionInfo = await db.get({ table: 'session', key: session.magicId })
  }
  catch (e) {
    console.log(e)
  }
  const verified = sessionInfo?.verified

  if (!verified) {
    // still waiting
    return {
      json: { wsUrl, wsScriptUrl, magicQueryId }
    }
  }
  if (signingUp) {
    return {
      session:{ verifiedEmail:sessionInfo?.email },
      location: '/auth/register'
    }
  }
  if (!signingUp) {
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
        session: { ...newSession, account: { user, permissions } },
        location: redirectAfterAuth
      }
    }
    else {
      // Verified Email but not a user
      return {
        session: {},
        location: '/auth/signup'
      }
    }
  }

}

function getWS () {
  let env = process.env.ARC_ENV
  let testing = 'ws://localhost:3333'
  let staging = 'TODO: these urls are printed after create'
  let production = 'TODO: these urls are printed after create'
  if (env === 'testing')
    return testing
  if (env === 'staging')
    return staging
  if (env === 'production')
    return production
  return testing
}

`
}
