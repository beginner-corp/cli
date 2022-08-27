/* eslint-disable filenames/match-regex */
module.exports = function () {
  return `/* eslint-disable filenames/match-regex */
// View documentation at: https://docs.begin.com
import { getRole, upsertRole, validate } from '../../../models/roles.mjs'
import canI from '../../../models/auth/helpers/can-i.mjs'

export async function get (req) {
  const iCan = canI( req, { role: 'admin' } )
  if (iCan) {
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
  } else {
    return {
      location: '/roles'
    }
  }
}

export async function post (req) {
  const id = req.pathParameters?.id
  const iCan = canI( req, { role: 'admin' } )
  if (iCan) {

    // Validate
    let { problems, role } = await validate.update(req)
    if (problems) {
      return {
        session: { problems, role },
        json: { problems, role },
        location: \`/roles/\${ role.key }\`
      }
    }

    try {
      const result = await upsertRole({key: id, ...role})
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
  } else {
    return {
      location: '/roles'
    }
  }
}
`
}
