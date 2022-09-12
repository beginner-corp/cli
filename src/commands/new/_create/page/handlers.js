let copy = {
  en: {
    view_docs: 'View documentation at: https://enhance.dev/docs/learn/starter-project/pages',
  }
}

let javascript = lang => `// ${copy[lang].view_docs}

/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export default function Html ({ html, state }) {
  // eslint-disable-next-line
  const { attrs, store } = state
  return html\`<section class="m-auto p2 color-light font-sans">
    <h1 class="mb1 font-semibold text3">Index page</h1>
    <p>html content for home page here</p>
  </section>
\`
}
`

let html = () => `<section class="m-auto p2 color-light font-sans">
  <h1 class="mb1 font-semibold text3">Index page</h1>
  <p>html content for home page here</p>
</section>
`

module.exports = { html, javascript }
