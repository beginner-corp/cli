module.exports = function ({ plural, singular, capSingular  }) {
  return `import { upsert${capSingular} } from '@architect/shared/db/${plural}.mjs'
import { ${capSingular} } from '@architect/shared/schemas/${singular}.mjs'

export default async function HTML(req) {
    try {
        await upsert${capSingular}(req.body)
    } catch (err) {
        return { statusCode: 400, json: { errors: [err.message] }}
    }

    return {
        location: '/${plural}'
    }
}
`
}
