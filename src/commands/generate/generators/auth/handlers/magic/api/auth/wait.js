module.exports = function () {
  return `import arc from '@architect/functions'
import db from '@begin/data'
import { getUsers } from '../../../models/users.mjs'
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
  catch (e){}
  const verified = sessionInfo?.verified

  if (!verified) {
    // still waiting
    return {
      json: { wsUrl, wsScriptUrl, magicQueryId }
    }
  }
  if (signingUp) {
    // TODO: Add New User
  }
  if (!signingUp) {
    let users, user
    try {
      users = await getUsers({ table: 'users' })
      user = users.find(i => i.email === sessionInfo.email)
    }
    catch (e){}

    if (user) {
      // Verified User
      return {
        session: { ...newSession, account: user },
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
