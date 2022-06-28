module.exports = function ({ singular, capSingular }) {
  return `import { ${capSingular} } from '@architect/shared/schemas/${singular}.mjs'
import { validator } from '@begin/validator'

export default async function validate(req) {
    if (req.body.ID) {
        return {
            statusCode: 422,
            json: { error: 'Create should not include an ID parameter' }
        }
    }
    let res = validator(req, ${capSingular} )
    if (!res.valid) {
        return {
            statusCode: 500,
            json: { error: res.errors.map(e => e.stack).join('\\n') }
        }
    }
}`
}
