module.exports = function ({ plural, singular, capSingular }) {
  return `import { isJSON } from '@begin/validator'
import { upsert${capSingular} } from '@architect/shared/db/${plural}.mjs'

export default async function json(req) {
    if (isJSON(req)) {
        try {
            const ${singular} = await upsert${capSingular}(req.body)
            return {
                json: ${singular}
            }
        }
        catch (err) {
            return {
                statusCode: 500,
                json: { error: err.message }
            }
        }
    }
    else {
        return false
    }
}`
}
