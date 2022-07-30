module.exports = function ({ plural, singular }) {
  return `// View documentation at: https://docs.begin.com
const rows = (item = {}) => {
    return \`\${Object.keys(item).map((key) => {
        if (typeof item[key] === 'object') {
            return rows(item[key])
        } else {
            return \`<p><strong>\${key}: </strong>\${item[key]}</p>\`
        }
    }).join('')}\`
  }

  export default function Html ({ html, state }) {
    console.log('list ${plural}')
    const { store } = state
    let ${plural} = store.${plural}?.map(item=> \`<div>\${rows(item)}</div><p><a href="/${plural}/\${item.key}">Edit this ${singular}</a></p><p><form action="/${plural}/\${item.key}/delete" method="POST"><button>Delete this ${singular}</button></form></p>\`).join('')

    return html\`
    <el-header></el-header>
    <section>
      <h1>Index page</h1>
      \${${plural}}
      <div>
        <a href="/${plural}/new">New ${singular}</a>
      </div>
    </section>
    <el-footer message="hi there"></el-footer>
    \`
  }`
}
