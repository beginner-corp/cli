module.exports = function ({ plural, capSingular  }) {
  return `// View documentation at: https://docs.begin.com
import { delete${capSingular} } from '../../../../models/${plural}.mjs'

export async function post (req) {
  const id = req.pathParameters?.id

  try {
    await delete${capSingular}(id)
    return {
      session: {},
      json: null,
      location: '/${plural}'
    }
  }
  catch (err) {
    return {
      session: { error: err.message },
      json: { error: err.message },
      location: '/${plural}'
    }
  }
}
`
}
