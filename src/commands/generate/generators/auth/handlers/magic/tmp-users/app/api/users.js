module.exports = function () {
  return `// View documentation at: https://docs.begin.com
import { getUsers, upsertUser, validate } from '../../models/users.mjs'

export async function get (req) {
  const users = await getUsers()
  if (req.session.problems) {
    let { problems, user,...session } = req.session
    return {
      session,
      json: { problems, users, user }
    }
  }

  return {
    json: { users }
  }
}

export async function post (req) {
  // Validate
  let { problems, user } = await validate.create(req)
  if (problems) {
    return {
      session: { problems, user },
      json: { problems, user },
      location: '/users'
    }
  }

  try {
    const result = await upsertUser(user)
    return {
        session: {},
        json: { user: result },
        location: '/users'
    }
  }
  catch (err) {
      return {
          session: { error: err.message },
          json: { error: err.message },
          location: '/users'
      }
  }
}
`
}
