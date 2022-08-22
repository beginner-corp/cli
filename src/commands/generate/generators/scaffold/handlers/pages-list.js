const { schemaToForm } = require('../schema-to-form')

function schemaToList ({ schema = {}, prefix = '' }) {
  return Object.keys(schema.properties).map(key => {
    if (schema.properties[key].type === 'object') {
      return schemaToList({ schema: schema.properties[key], prefix: `.${key}?` })
    }
    else {
      return `<p class="pb-2"><strong class="capitalize">${key.replace(/([a-z])([A-Z])/g, '$1 $2')}: </strong>\${item?${prefix}.${key} || ''}</p>`
    }
  }
  ).join('\n  ')
}

module.exports = function ({ plural, singular, capPlural, schema }) {
  let list = schemaToList({ schema })

  return `// View documentation at: https://docs.begin.com
export default function Html ({ html, state }) {
  const { store } = state
  let ${plural} = store.${plural} || []
  const ${singular} = store.${singular} || {}
  const problems = store.problems || {}

  return html\`
  <section>
    <h1 class="mb1 font-semibold text3">${capPlural} page</h1>
    \${${plural}.map(item => \`<div class="mb0">
  ${list}
</div>
<p class="mb-1">
  <a href="/${plural}/\${item.key}">Edit this ${singular}</a>
</p>
<form action="/${plural}/\${item.key}/delete" method="POST" class="mb-1">
  <enhance-submit-button><span slot="label">Delete this ${singular}</span></enhance-submit-button>
</form>\`).join('\\n')}
<details \${Object.keys(problems).length ? 'open' : ''}>
    <summary>New ${singular}</summary>
    ${schemaToForm({ action: plural, schema, update: true, data: singular })}
</details>
</section>
  \`
}
`
}
