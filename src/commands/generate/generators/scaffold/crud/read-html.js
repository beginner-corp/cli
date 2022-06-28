// this needs to become a custom element
module.exports = function ({ plural, singular, capSingular }) {
  return `import { get${capSingular} } from '@architect/shared/db/${plural}.mjs'
import { ${capSingular} } from '@architect/shared/schemas/${singular}.mjs'
import { schemaToForm } from '@architect/views/schema-to-form.mjs'

export default async function HTML(req) {
    const id = req.pathParameters?.id
    const ${singular} = await get${capSingular}(id)

    return {
        html: schemaToForm('${plural}', ${capSingular}, ${singular})
    }
}`
}
