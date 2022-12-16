module.exports = function () {
  return `/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function Html ({ html, state }) {
  const { store } = state
  const registration = store.registration || {}
  const problems = store.problems || {}

  return html\`<page-container>
  <main>
    <h1 class="mb1 font-semibold text3">Register New User</h1>
    <form-element
  action="/auth/register/\${registration.key}"
  method="POST">
  <div class="\${problems.form ? 'block' : 'hidden'}">
    <p>Found some problems!</p>
    <ul>\${problems.form}</ul>
  </div>
  <field-set legend="User">
  <text-input label="Firstname" type="text" id="firstname" name="firstname" value="\${registration?.firstname}" errors="\${problems?.firstname?.errors}"></text-input>
  <text-input label="Lastname" type="text" id="lastname" name="lastname" value="\${registration?.lastname}" errors="\${problems?.lastname?.errors}"></text-input>
  <submit-button style="float: right"><span slot="label">Save</span></submit-button>
  </field-set>
</form-element>
</main>
</page-container>
\`
}`
}
