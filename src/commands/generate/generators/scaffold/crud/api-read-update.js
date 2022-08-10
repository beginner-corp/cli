module.exports = function ({ plural, singular, capSingular  }) {
  return `// View documentation at: https://docs.begin.com
import { get${capSingular}, upsert${capSingular} } from '../../db/${plural}.mjs'
import { ${capSingular} } from '../../schemas/${singular}.mjs'
import { isJSON, validator } from '@begin/validator'

export async function get (req) {
  const id = req.pathParameters?.id
  const ${singular} = await get${capSingular}(id)
  return {
    json: { ${singular} }
  }
}

export async function post (req) {
  const id = req.pathParameters?.id

  // Validate
  let res = validator(req, ${capSingular} )
  if (!res.valid) {
      return {
          statusCode: 500,
          json: { error: res.errors.map(e => e.stack).join('\\n') }
      }
  }

  await upsert${capSingular}({key: id, ...req.body})
  return {
    location: '/${plural}'
  }
}
`
}
