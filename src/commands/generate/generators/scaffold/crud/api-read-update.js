module.exports = function ({ plural, singular, capSingular  }) {
  return `// View documentation at: https://docs.begin.com
  import { get${capSingular}, upsert${capSingular} } from '../../db/${plural}.mjs'

  export async function get (req) {
    const id = req.pathParameters?.id
    const ${singular} = await get${capSingular}(id)
    return {
      json: { ${singular} }
    }
  }

  export async function post (req) {
    const id = req.pathParameters?.id
    // TODO add validation
    await upsert${capSingular}({key: id, ...req.body})
    return {
      location: '/${plural}'
    }
  }
`
}
