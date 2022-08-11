module.exports = function ({ plural, capPlural, singular, capSingular  }) {
  return `// View documentation at: https://docs.begin.com
import { get${capPlural}, upsert${capSingular}, validate } from '../../models/${plural}.mjs'

export async function get (req) {
  const ${plural} = await get${capPlural}()
  return {
    json: { ${plural} }
  }
}

export async function post (req) {
  // Validate
  let problems = await validate.create(req)
  if (problems) {
    return {
      session: { problems },
      json: { problems },
      location: '/${plural}/new'
    }
  }

  try {
    const ${singular} = await upsert${capSingular}(req.body)
    return {
        session: {},
        json: { ${singular} },
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
