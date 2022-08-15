function schemaToList ({ schema = {}, prefix = '' }) {
  return Object.keys(schema.properties).map(key => {
    console.log(schema.properties[key])
    if (schema.properties[key].type === 'object') {
      return schemaToList({ schema: schema.properties[key], prefix: `.${key}?` })
    }
    else {
      return `<p><strong>${key}: </strong>\${item?${prefix}.${key}}</p>`
    }
  }
  ).join('\n  ')
}

module.exports = function ({ plural, singular, schema }) {
  console.log('create list', schema)
  let list = schemaToList({ schema })

  return `// View documentation at: https://docs.begin.com
export default function Html ({ html, state }) {
  const { store } = state
  let ${plural} = store.${plural} || []

  return html\`
  <section>
    <h1>Index page</h1>
    \${${plural}.map(item => \`<div>
  ${list}
</div>
<p>
  <a href="/${plural}/\${item.key}">Edit this ${singular}</a>
</p>
<p>
  <form action="/${plural}/\${item.key}/delete" method="POST">
    <button>Delete this ${singular}</button>
  </form>
</p>\`).join('\\n')}
    <div>
      <a href="/${plural}/new">New ${singular}</a>
    </div>
  </section>
  \`
}
`
}
