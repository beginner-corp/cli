module.exports = function ({ plural, singular, capSingular  }) {
  return `// View documentation at: https://docs.begin.com
    import { ${capSingular} } from '../../schemas/${singular}.mjs'
    import { schemaToForm } from '../../schemas/schema-to-form.mjs'

    export default function Html ({ html, state }) {
      const { store } = state
      const ${singular} = store.${singular} || {author:'', title:''}
      const form = schemaToForm('${plural}', ${capSingular}, ${singular})
      return html\`
      \${form}
    \`
    }`
}
