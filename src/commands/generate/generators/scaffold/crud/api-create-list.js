module.exports = function ({ plural, capPlural, singular, capSingular  }) {
  return `// View documentation at: https://docs.begin.com
import { get${capPlural}, upsert${capSingular} } from '../db/${plural}.mjs'
import { ${capSingular} } from '../schemas/${singular}.mjs'
import { validator } from '@begin/validator'

export async function get (req) {
  const ${plural} = await get${capPlural}()
  return {
    json: { ${plural} }
  }
}

export async function post (req) {
  // Validate
  if (req.body.key) {
    return {
        statusCode: 422,
        json: { error: 'Create should not include an key parameter' }
    }
  }
  let res = validator(req, ${capSingular} )
  if (!res.valid) {
      return {
          statusCode: 500,
          json: { error: res.errors.map(e => e.stack).join('\\n') }
      }
  }

  try {
    const ${singular} = await upsert${capSingular}(req.body)
    return {
        session: {},
        json: { ${singular} },
        location: '/accounts'
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
