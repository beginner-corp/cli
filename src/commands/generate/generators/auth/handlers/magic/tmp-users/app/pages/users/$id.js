/* eslint-disable filenames/match-regex */
module.exports = function () {
  return `/* eslint-disable filenames/match-regex */
// View documentation at: https://docs.begin.com
export default function Html ({ html, state }) {
  const { store } = state
  const user = store.user || {}
  const problems = store.problems || {}

  return html\`<enhance-page-container>
  <enhance-form
  action="/users/\${user.key}"
  method="POST">
  <div class="\${problems.form ? 'block' : 'hidden'}">
    <p>Found some problems!</p>
    <ul>\${problems.form}</ul>
  </div>
  <enhance-fieldset legend="User">
  <enhance-text-input label="Firstname" type="text" id="firstname" name="firstname" value="\${user?.firstname}" errors="\${problems?.firstname?.errors}"></enhance-text-input>
  <enhance-text-input label="Lastname" type="text" id="lastname" name="lastname" value="\${user?.lastname}" errors="\${problems?.lastname?.errors}"></enhance-text-input>
  <enhance-text-input label="Email" type="email" id="email" name="email" required value="\${user?.email}" errors="\${problems?.email?.errors}"></enhance-text-input>
  <input type="hidden" id="key" name="key" value="\${user?.key}" />
  <h2>Roles</h2><enhance-text-input label="Role1" type="text" id="roles.role1" name="roles.role1" value="\${user?.roles?.role1}" errors="\${problems?.roles?.role1?.errors}"></enhance-text-input>
<enhance-text-input label="Role2" type="text" id="roles.role2" name="roles.role2" value="\${user?.roles?.role2}" errors="\${problems?.roles?.role2?.errors}"></enhance-text-input>
<enhance-text-input label="Role3" type="text" id="roles.role3" name="roles.role3" value="\${user?.roles?.role3}" errors="\${problems?.roles?.role3?.errors}"></enhance-text-input>
  <enhance-submit-button style="float: right"><span slot="label">Save</span></enhance-submit-button>
  </enhance-fieldset>
</enhance-form>
</enhance-page-container>\`
}
`
}
