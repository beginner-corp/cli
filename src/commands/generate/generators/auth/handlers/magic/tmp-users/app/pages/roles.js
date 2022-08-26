module.exports = function () {
  return `// View documentation at: https://docs.begin.com
export default function Html ({ html, state }) {
  const { store } = state
  let roles = store.roles || []
  const role = store.role || {}
  const problems = store.problems || {}

  return html\`<enhance-page-container>
  <main>
    <h1 class="mb1 font-semibold text3">Roles page</h1>
    \${roles.map(item => \`<article class="mb2">
<div class="mb0">
  <p class="pb-2"><strong class="capitalize">name: </strong>\${item?.name || ''}</p>
  <p class="pb-2"><strong class="capitalize">description: </strong>\${item?.description || ''}</p>
  <p class="pb-2"><strong class="capitalize">key: </strong>\${item?.key || ''}</p>
  <p class="pb-2"><strong class="capitalize">action1: </strong>\${item?.rules?.action1 || ''}</p>
  <p class="pb-2"><strong class="capitalize">target1: </strong>\${item?.rules?.target1 || ''}</p>
  <p class="pb-2"><strong class="capitalize">owner1: </strong>\${item?.rules?.owner1 || ''}</p>
  <p class="pb-2"><strong class="capitalize">id1: </strong>\${item?.rules?.id1 || ''}</p>
  <p class="pb-2"><strong class="capitalize">action2: </strong>\${item?.rules?.action2 || ''}</p>
  <p class="pb-2"><strong class="capitalize">target2: </strong>\${item?.rules?.target2 || ''}</p>
  <p class="pb-2"><strong class="capitalize">owner2: </strong>\${item?.rules?.owner2 || ''}</p>
  <p class="pb-2"><strong class="capitalize">id2: </strong>\${item?.rules?.id2 || ''}</p>
</div>
<p class="mb-1">
  <enhance-link href="/roles/\${item.key}">Edit this role</enhance-link>
</p>
<form action="/roles/\${item.key}/delete" method="POST" class="mb-1">
  <enhance-submit-button><span slot="label">Delete this role</span></enhance-submit-button>
</form>
</article>\`).join('\\n')}
<details class="mb0" \${Object.keys(problems).length ? 'open' : ''}>
    <summary>New role</summary>
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
</details>
</main>
</enhance-page-container>
\`
}
`
}
