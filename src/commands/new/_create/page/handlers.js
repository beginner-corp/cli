let copy = {
  en: {
    view_docs: 'View documentation at: https://docs.begin.com',
  }
}

let javascript = lang => `// ${copy[lang].view_docs}
export default function FiveHundred ({ html, state }) {
  const { attrs } = state
  return html\`
  <el-header></el-header>
  <section>
    <h1>Index page</h1>
    <p>html content for home page here</p>
  </section>
  <el-footer message="hi there"></el-footer>
\`
}
`

let html = () => `<el-header></el-header>
<section>
  <h1>Index page</h1>
  <p>html content for home page here</p>
</section>
<el-footer message="hi there"></el-footer>
`

module.exports = { html, javascript }
