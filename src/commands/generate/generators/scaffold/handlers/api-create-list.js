module.exports = function ({ plural, capPlural, singular, capSingular, includeAuth = false, authRole = 'admin'  }) {
  return `// View documentation at: https://enhance.dev/docs/learn/starter-project/api
/**
  * @typedef {import('@enhance/types').EnhanceApiFn} EnhanceApiFn
  */
import { get${capPlural}, upsert${capSingular}, validate } from '../models/${plural}.mjs'
${includeAuth ? `import canI from '../models/auth/can-i.mjs'` : ''}

/**
 * @type {EnhanceApiFn}
 */
export async function get (req) {${includeAuth ? `
  const admin = canI(req, '${authRole}')
  if (!admin) {
    return {
      location: '/'
    }
  }

  ` : ''}
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

/**
 * @type {EnhanceApiFn}
 */
export async function post (req) {${includeAuth ? `
  const admin = canI(req, '${authRole}')
  if (!admin) {
    return {
      statusCode: 401
    }
  }

  ` : ''}
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

  // eslint-disable-next-line no-unused-vars
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
