// this needs to become a custom element
module.exports = function ({ plural, singular, capSingular }) {
  return `import { ${capSingular} } from '@architect/shared/schemas/${singular}.mjs'
import { schemaToForm } from '@architect/views/schema-to-form.mjs'

export default async function HTML(req) {
    return {
        html: schemaToForm('${plural}', ${capSingular}, {})
    }
}`
}
