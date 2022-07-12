export default function Index({ html, state }) {
  const { store } = state
  const { thing='huh?' } = store
  return html`
<el-header></el-header>
<section>
  <h1>Index page</h1>
  <p>${thing}</p>
</section>
<el-footer></el-footer>
`
}
