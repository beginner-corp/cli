module.exports = function ({ plural, capSingular, singular, includeAuth = false, authRole = 'admin'   }) {
  return `// View documentation at: https://enhance.dev/docs/learn/starter-project/api
import { delete${capSingular} } from '../../../models/${plural}.mjs'
${includeAuth ? `import canI from '../../../models/auth/can-i.mjs'` : ''}

/**
 * @type {import('@enhance/types').EnhanceApiFn}
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
  // eslint-disable-next-line no-unused-vars
  let { problems: removedProblems, ${singular}: removed, ...newSession } = session
  try {
    await delete${capSingular}(id)
    return {
      session: newSession,
      json: null,
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
