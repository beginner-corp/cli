module.exports = function ({ plural, singular, capSingular  }) {
  return `// View documentation at: https://docs.begin.com
import { get${capSingular}, upsert${capSingular}, validate } from '../../../models/${plural}.mjs'

export async function get (req) {
  if (req.session.problems) {
    let { problems, ...session } = req.session
    return {
      session,
      json: { ...problems }
    }
  }

  const id = req.pathParameters?.id
  const ${singular} = await get${capSingular}(id)
  return {
    json: { ${singular} }
  }
}

export async function post (req) {
  const id = req.pathParameters?.id

  // Validate
  let problems = await validate.update(req)
  if (problems) {
    let key = problems.${singular}.key || 'new'
    return {
      session: { problems },
      json: { problems },
      location: \`/${plural}/\${key}\`
    }
  }

  try {
    const ${singular} = await upsert${capSingular}({key: id, ...req.body})
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
