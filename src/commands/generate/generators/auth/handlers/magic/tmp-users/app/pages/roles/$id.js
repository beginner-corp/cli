/* eslint-disable filenames/match-regex */
module.exports = function () {
  return `/* eslint-disable filenames/match-regex */
// View documentation at: https://docs.begin.com
export default function Html ({ html, state }) {
  const { store } = state
  const role = store.role || {}
  const problems = store.problems || {}

  return html\`<enhance-page-container>
    <enhance-form
      action="/roles/\${role.key}"
      method="POST">
      <div class="\${problems.form ? 'block' : 'hidden'}">
        <p>Found some problems!</p>
        <ul>\${problems.form}</ul>
      </div>
      <enhance-fieldset legend="Role">
        <enhance-text-input label="Name" type="text" id="name" name="name" required value="\${role?.name}" errors="\${problems?.name?.errors}"></enhance-text-input>
        <enhance-text-input label="Description" type="text" id="description" name="description" value="\${role?.description}" errors="\${problems?.description?.errors}"></enhance-text-input>
        <input type="hidden" id="key" name="key" value="\${role?.key}" />
        <h2>Rules</h2><select id="rules.action1.action1" name="rules.action1.action1"><option value="" ></option><option value="create" >create</option><option value="read" >read</option><option value="update" >update</option><option value="delete" >delete</option><option value="change_permissions" >change_permissions</option></select>
        <select id="rules.target1.target1" name="rules.target1.target1"><option value="" ></option><option value="posts" >posts</option><option value="users" >users</option><option value="roles" >roles</option></select>
        <select id="rules.owner1.owner1" name="rules.owner1.owner1"><option value="" ></option><option value="SELF" >SELF</option><option value="ALL" >ALL</option><option value="user" >user</option></select>
        <enhance-text-input label="Id1" type="text" id="rules.id1" name="rules.id1" value="\${role?.rules?.id1}" errors="\${problems?.rules?.id1?.errors}"></enhance-text-input>
        <select id="rules.action2.action2" name="rules.action2.action2"><option value="" ></option><option value="create" >create</option><option value="read" >read</option><option value="update" >update</option><option value="delete" >delete</option><option value="change_permissions" >change_permissions</option></select>
        <select id="rules.target2.target2" name="rules.target2.target2"><option value="" ></option><option value="posts" >posts</option><option value="users" >users</option><option value="roles" >roles</option></select>
        <select id="rules.owner2.owner2" name="rules.owner2.owner2"><option value="" ></option><option value="SELF" >SELF</option><option value="ALL" >ALL</option><option value="user" >user</option></select>
        <enhance-text-input label="Id2" type="text" id="rules.id2" name="rules.id2" value="\${role?.rules?.id2}" errors="\${problems?.rules?.id2?.errors}"></enhance-text-input>
        <enhance-submit-button style="float: right"><span slot="label">Save</span></enhance-submit-button>
      </enhance-fieldset>
    </enhance-form>
</enhance-page-container>\`
}
`
}
