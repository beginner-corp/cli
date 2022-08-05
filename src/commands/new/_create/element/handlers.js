let copy = {
  en: {
    view_docs: 'View documentation at: https://docs.begin.com',
  }
}

let node = lang => `// ${copy[lang].view_docs}
export default function Element ({ html, state }) {
  return html\`
<div>
  <p>\${state.attrs.message || 'Hello World!'}</p>
</div>\`
}

`

module.exports = { node }
