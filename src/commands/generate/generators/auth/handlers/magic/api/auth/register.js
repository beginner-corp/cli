module.exports = function () {
  return `// View documentation at: https://docs.begin.com
import { getUsers, upsertUser } from '../../../models/users.mjs'
import { getRoles } from '../../../models/roles.mjs'
import { validate } from '../../../models/registration.mjs'

export async function get (req) {
  const session = req.session
  const verifiedEmail = session?.verifiedEmail

  if (!verifiedEmail){
    return {
      session: {},
      location: '/auth/signup'
    }
  }

  if (session?.problems) {
    let { problems, user, ...session } = req.session
    return {
      session,
      json: { problems, user, email:verifiedEmail }
    }
  }

  return {
    json: { email:verifiedEmail}
  }
}

export async function post (req) {
  const session = req.session
  const verifiedEmail = session?.verifiedEmail
  // Validate
  let { problems, registration } = await validate.create(req)
  // TODO: this needs to go elsewhere
  const user = { ...registration, email:verifiedEmail , roles: { role1: 'member', role2: '', role3: '' } }
  if (problems) {
    return {
      session: { ...session, problems, registration },
      json: { problems, registration, email:verifiedEmail },
      location: '/auth/register'
    }
  }

  try {
    const users = await getUsers()
    const exists = users.find(dbUser => dbUser.email === verifiedEmail)
    if (!exists){
      const newUser = await upsertUser(user)
      const roles = await getRoles()
      const permissions = Object.values(newUser?.roles).filter(Boolean).map(role => roles.find(i => role === i.name))
      return {
        session: {account: { user:newUser, permissions } },
        json: { account: { user: newUser, permissions } },
        location: '/auth/welcome'
      }
    }
    else {
      // TODO: Add better error message. This should only happen if two people try to register the same user simultaneously.
      console.error('User already registered with this email')
      return {
        session: {},
        location: '/auth/signup'
      }
    }
  }
  catch (err) {
    console.log(err)
    return {
      session: { error: err.message },
      json: { error: err.message },
      location: '/auth/register'
    }
  }
}



`
}
