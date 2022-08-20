module.exports = function ({ plural, capPlural, singular, capSingular  }) {
  return `// View documentation at: https://docs.begin.com
import { get${capPlural}, upsert${capSingular}, validate } from '../../models/${plural}.mjs'

export async function get (req) {
  const ${plural} = await get${capPlural}()
  if (req.session.problems) {
    let { problems, ${singular},...session } = req.session
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
  // Validate
  let { problems, ${singular} } = await validate.create(req)
  if (problems) {
    return {
      session: { problems, ${singular} },
      json: { problems, ${singular} },
      location: '/${plural}'
    }
  }

  try {
    const result = await upsert${capSingular}(${singular})
    return {
        session: {},
        json: { ${singular}: result },
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
