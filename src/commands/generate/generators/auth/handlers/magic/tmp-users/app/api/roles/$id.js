/* eslint-disable filenames/match-regex */
module.exports = function () {
  return `/* eslint-disable filenames/match-regex */
// View documentation at: https://docs.begin.com
import { getRole, upsertRole, validate } from '../../../models/roles.mjs'
import canI from '../../../models/auth/am-i.mjs'

export async function get (req) {
  const admin = amI( req, 'admin' )
  if (admin) {
    if (req.session.problems) {
      let { problems, role, ...session } = req.session
      return {
        session,
        json: { problems, role }
      }
    }

    const id = req.pathParameters?.id
    const result = await getRole(id)
    return {
      json: { role: result }
    }
  }
  else {
    return {
      location: '/roles'
    }
  }
}

export async function post (req) {
  const id = req.pathParameters?.id
  const admin = amI( req, 'admin'  )
  if (admin) {

    // Validate
    let { problems, role } = await validate.update(req)
    if (problems) {
      return {
        session: { problems, role },
        json: { problems, role },
        location: \`/roles/\${role.key}\`
      }
    }

    try {
      const result = await upsertRole({ key: id, ...role })
      return {
        session: {},
        json: { role: result },
        location: '/roles'
      }
    }
    catch (err) {
      return {
        session: { error: err.message },
        json: { error: err.message },
        location: '/roles'
      }
    }
  }
  else {
    return {
      statusCode: 401
    }
  }
}

`
}
