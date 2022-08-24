let copy = {
  en: {
    view_docs: 'View documentation at: https://docs.begin.com',
  }
}

let javascript = lang => `// ${copy[lang].view_docs}
export default function Html ({ html, state }) {
  // eslint-disable-next-line
  const { attrs, store } = state
  return html\`<section>
    <h1>Index page</h1>
    <p>html content for home page here</p>
  </section>
\`
}
`

let html = () => `<section>
  <h1>Index page</h1>
  <p>html content for home page here</p>
</section>
`

module.exports = { html, javascript }
