module.exports = function () {
  return `// View documentation at: https://docs.begin.com
import { getRoles, upsertRole, validate } from '../../models/roles.mjs'

export async function get (req) {
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
}

export async function post (req) {
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
}
`
}
