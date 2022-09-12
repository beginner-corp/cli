let copy = {
  en: {
    view_docs: 'View documentation at: https://enhance.dev/docs/learn/starter-project/elements',
  }
}

let node = lang => `// ${copy[lang].view_docs}
/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export default function Element ({ html, state }) {
  return html\`
<div>
  <p>\${state.attrs.message || 'Hello World!'}</p>
</div>\`
}

`

module.exports = { node }
