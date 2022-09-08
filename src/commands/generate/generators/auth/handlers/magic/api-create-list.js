module.exports = function ({ plural, capPlural, singular, capSingular  }) {
  return `// View documentation at: https://docs.begin.com
import { get${capPlural}, upsert${capSingular}, validate } from '../../models/${plural}.mjs'
import canI from '../../models/auth/can-i.mjs'

export async function get (req) {
  const admin = canI(req, 'admin')
  if (!admin) {
    return {
      location: '/'
    }
  }

  const ${plural} = await get${capPlural}()
  if (req.session.problems) {
    let { problems, ${singular}, ...session } = req.session
    return {
      session,
      json: { problems, ${plural}, ${singular} }
    }
  }

  return {
    json: { ${plural} }
  }
}

export async function post (req) {
  const admin = canI(req, 'admin')
  if (!admin) {
    return {
      statusCode: 401
    }
  }
  const session = req.session
  // Validate
  let { problems, ${singular} } = await validate.create(req)
  if (problems) {
    return {
      session: { ...session, problems, ${singular} },
      json: { problems, ${singular} },
      location: '/${plural}'
    }
  }

  let { problems: removedProblems, ${singular}: removed, ...newSession } = session
  try {
    const result = await upsert${capSingular}(${singular})
    return {
      session: newSession,
      json: { ${singular}: result },
      location: '/${plural}'
    }
  }
  catch (err) {
    return {
      session: { ...newSession, error: err.message },
      json: { error: err.message },
      location: '/${plural}'
    }
  }
}
`
}
