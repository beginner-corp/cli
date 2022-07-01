module.exports = function ({ plural, singular, capSingular }) {
  return `import { isJSON } from '@begin/validator'
import { get${capSingular} } from '@architect/shared/db/${plural}.mjs'

export default async function json(req) {
    if (isJSON(req)) {
        try {
            const id = req.pathParameters?.id
            const ${singular} = id ? await get${capSingular}(id) : {}

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
