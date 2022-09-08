module.exports = function ({ plural, capSingular, singular  }) {
  return `// View documentation at: https://docs.begin.com
import { delete${capSingular} } from '../../../../models/${plural}.mjs'
import canI from '../../../../models/auth/can-i.mjs'

export async function post (req) {
  const admin = canI(req, 'admin')
  if (!admin) {
    return {
      statusCode: 401
    }
  }
  const id = req.pathParameters?.id
  
  const session = req.session
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
