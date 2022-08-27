module.exports = function () {
  return `// View documentation at: https://docs.begin.com
import { getRoles, upsertRole, validate } from '../../models/roles.mjs'
import canI from '../../models/auth/helpers/can-i.mjs'

export async function get (req) {
  const iCan = canI( req, { role: 'admin' } )
  if (iCan) {

    const roles = await getRoles()
    if (req.session.problems) {
      let { problems, role, ...session } = req.session
      return {
        session,
        json: { problems, roles, role }
      }
    }

    return {
      json: { roles }
    }
  } else {
    return {
      location: '/'
    }
  }
}

export async function post (req) {
   const iCan = canI( req, { role: 'admin' } )
  if (iCan) {

    // Validate
    let { problems, role } = await validate.create(req)
    if (problems) {
      return {
        session: { problems, role },
        json: { problems, role },
        location: '/roles'
      }
    }

    try {
      const result = await upsertRole(role)
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
      location: '/'
    }
  }
}
`
}
