const { schemaToForm } = require('../schema-to-form')

module.exports = function ({ plural, schema }) {
  return `// View documentation at: https://docs.begin.com
export default function Html ({ html, state }) {
  return html\`
  ${schemaToForm({ action: plural, schema })}
\`
}`
}
