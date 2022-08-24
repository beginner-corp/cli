module.exports = function ({ plural, singular, capSingular  }) {
  return `// View documentation at: https://docs.begin.com
import { get${capSingular}, upsert${capSingular}, validate } from '../../../models/${plural}.mjs'

export async function get (req) {
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

export async function post (req) {
  const id = req.pathParameters?.id

  // Validate
  let { problems, ${singular} } = await validate.update(req)
  if (problems) {
    return {
      session: { problems, ${singular} },
      json: { problems, ${singular} },
      location: \`/${plural}/\${${singular}.key}\`
    }
  }

  try {
    const result = await upsert${capSingular}({key: id, ...${singular}})
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
