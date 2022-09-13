const { schemaToForm } = require('../schema-to-form')

module.exports = function ({ plural, singular, schema }) {
  return `// View documentation at: https://docs.begin.com
/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function Html ({ html, state }) {
  const { store } = state
  const ${singular} = store.${singular} || {}
  const problems = store.problems || {}

  return html\`<enhance-page-container>
  ${schemaToForm({ action: plural, schema, update: true, data: singular })}
</enhance-page-container>\`
}
`
}
