module.exports = function ({ plural, singular, capSingular, includeAuth = false, authRole = 'admin'    }) {
  return `// View documentation at: https://docs.begin.com
/**
  * @typedef {import('@enhance/types').EnhanceApiFn} EnhanceApiFn
  */
import { get${capSingular}, upsert${capSingular}, validate } from '../../../models/${plural}.mjs'
${includeAuth ? `import canI from '../../../models/auth/can-i.mjs'` : ''}

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
  if (req.session.problems) {
    let { problems, ${singular}, ...session } = req.session
    return {
      session,
      json: { problems, ${singular} }
    }
  }

  const id = req.pathParameters?.id
  const result = await get${capSingular}(id)
  return {
    json: { ${singular}: result }
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
  const id = req.pathParameters?.id

  const session = req.session
  // Validate
  let { problems, ${singular} } = await validate.update(req)
  if (problems) {
    return {
      session: {...session, problems, ${singular} },
      json: { problems, ${singular} },
      location: \`/${plural}/\${${singular}.key}\`
    }
  }

  // eslint-disable-next-line no-unused-vars
  let { problems: removedProblems, ${singular}: removed, ...newSession } = session
  try {
    const result = await upsert${capSingular}({ key: id, ...${singular} })
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
