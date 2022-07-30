module.exports = function ({ plural, singular, capSingular  }) {
  return `// View documentation at: https://docs.begin.com
    import { ${capSingular} } from '../../schemas/${singular}.mjs'
    import { schemaToForm } from '../../schemas/schema-to-form.mjs'

    export default function Html ({ html, state }) {
      const { store } = state
      const ${singular} = store.${singular} || {author:'', title:''}
      console.log('why am i called?')
      console.log("${singular}", ${singular})
      const form = schemaToForm('${plural}', ${capSingular}, ${singular})
      return html\`
      <el-header></el-header>
      \${form}
      <el-footer message="hi there"></el-footer>
    \`
    }`
}
