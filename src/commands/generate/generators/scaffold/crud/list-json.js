module.exports = function ({ plural, capPlural }) {
  return `import { isJSON } from '@begin/validator'
import { get${capPlural} } from '@architect/shared/db/${plural}.mjs'

export default async function json(req) {
    if (isJSON(req)) {
        try {
            const ${plural} = await get${capPlural}()

            return {
                json: ${plural}
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
