/* eslint-disable filenames/match-regex */
module.exports = function () {
  return `/* eslint-disable filenames/match-regex */
// View documentation at: https://docs.begin.com
import { getUser, upsertUser, validate } from '../../../models/users.mjs'

export async function get (req) {
  if (req.session.problems) {
    let { problems, user, ...session } = req.session
    return {
      session,
      json: { problems, user }
    }
  }

  const id = req.pathParameters?.id
  const result = await getUser(id)
  return {
    json: { user: result }
  }
}

export async function post (req) {
  const id = req.pathParameters?.id

  // Validate
  let { problems, user } = await validate.update(req)
  if (problems) {
    return {
      session: { problems, user },
      json: { problems, user },
      location: \`/users/\${user.key}\`
    }
  }

  try {
    const result = await upsertUser({ key: id, ...user })
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
