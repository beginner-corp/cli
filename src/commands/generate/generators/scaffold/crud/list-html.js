module.exports = function ({ plural, capPlural, singular }) {
  return `import { get${capPlural} } from '@architect/shared/db/${plural}.mjs'

const rows = (item = {}) => {
    return \`\${Object.keys(item).map((key) => {
        if (typeof item[key] === 'object') {
            return rows(item[key])
        } else {
            return \`<p><strong>\${key}: </strong>\${item[key]}</p>\`
        }
    }).join('')}\`
}

const cards = (items = []) => {
    return items.map(item => \`<div>\${rows(item)}</div><p><a href="/${plural}/\${item.ID}">Edit this ${singular}</a></p><p><form action="/${plural}/\${item.ID}/delete" method="POST"><button>Delete this ${singular}</button></form></p>\`).join('')
}

export default async function HTML(req) {
    const ${plural} = await get${capPlural}()

    return {
        html: \`<h1>${capPlural}</h1>
\${cards(${plural})}

<div>
    <a href="/${plural}/new">New ${singular}</a>
</div>\`
    }
}`
}
