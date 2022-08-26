module.exports = function () {
  return `// View documentation at: https://docs.begin.com
import { deleteUser } from '../../../../models/users.mjs'

export async function post (req) {
  const id = req.pathParameters?.id

  try {
    await deleteUser(id)
    return {
      session: {},
      json: null,
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
