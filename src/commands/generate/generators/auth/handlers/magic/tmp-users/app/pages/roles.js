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
  <p class="pb-2"><strong class="capitalize">action_1: </strong>\${item?.rules?.action_1 || ''}</p>
  <p class="pb-2"><strong class="capitalize">target_1: </strong>\${item?.rules?.target_1 || ''}</p>
  <p class="pb-2"><strong class="capitalize">owner_1: </strong>\${item?.rules?.owner_1 || ''}</p>
  <p class="pb-2"><strong class="capitalize">id_1: </strong>\${item?.rules?.id_1 || ''}</p>
  <p class="pb-2"><strong class="capitalize">action_2: </strong>\${item?.rules?.action_2 || ''}</p>
  <p class="pb-2"><strong class="capitalize">target_2: </strong>\${item?.rules?.target_2 || ''}</p>
  <p class="pb-2"><strong class="capitalize">owner_2: </strong>\${item?.rules?.owner_2 || ''}</p>
  <p class="pb-2"><strong class="capitalize">id_3: </strong>\${item?.rules?.id_3 || ''}</p>
  <p class="pb-2"><strong class="capitalize">action_3: </strong>\${item?.rules?.action_3 || ''}</p>
  <p class="pb-2"><strong class="capitalize">target_3: </strong>\${item?.rules?.target_3 || ''}</p>
  <p class="pb-2"><strong class="capitalize">owner_3: </strong>\${item?.rules?.owner_3 || ''}</p>
  <p class="pb-2"><strong class="capitalize">id_3: </strong>\${item?.rules?.id_3 || ''}</p>
  <p class="pb-2"><strong class="capitalize">action_4: </strong>\${item?.rules?.action_4 || ''}</p>
  <p class="pb-2"><strong class="capitalize">target_4: </strong>\${item?.rules?.target_4 || ''}</p>
  <p class="pb-2"><strong class="capitalize">owner_4: </strong>\${item?.rules?.owner_4 || ''}</p>
  <p class="pb-2"><strong class="capitalize">id_4: </strong>\${item?.rules?.id_4 || ''}</p>
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
  <h2>Rules</h2>

<select id="rules.action_1.action_1" name="rules.action_1.action_1"><option value="" ></option><option value="create" >create</option><option value="read" >read</option><option value="update" >update</option><option value="delete" >delete</option><option value="change_permissions" >change_permissions</option></select>
<select id="rules.target_1.target_1" name="rules.target_1.target_1"><option value="" ></option><option value="posts" >posts</option><option value="users" >users</option><option value="roles" >roles</option></select>
<select id="rules.owner_1.owner_1" name="rules.owner_1.owner_1"><option value="" ></option><option value="SELF" >SELF</option><option value="ALL" >ALL</option><option value="user" >user</option></select>
<enhance-text-input label="Id_1" type="text" id="rules.id_1" name="rules.id_1" value="\${role?.rules?.id_1}" errors="\${problems?.rules?.id_1?.errors}"></enhance-text-input>

<select id="rules.action_2.action_2" name="rules.action_2.action_2"><option value="" ></option><option value="create" >create</option><option value="read" >read</option><option value="update" >update</option><option value="delete" >delete</option><option value="change_permissions" >change_permissions</option></select>
<select id="rules.target_2.target_2" name="rules.target_2.target_2"><option value="" ></option><option value="posts" >posts</option><option value="users" >users</option><option value="roles" >roles</option></select>
<select id="rules.owner_2.owner_2" name="rules.owner_2.owner_2"><option value="" ></option><option value="SELF" >SELF</option><option value="ALL" >ALL</option><option value="user" >user</option></select>
<enhance-text-input label="Id_2" type="text" id="rules.id_2" name="rules.id_2" value="\${role?.rules?.id_2}" errors="\${problems?.rules?.id_2?.errors}"></enhance-text-input>

<select id="rules.action_3.action_3" name="rules.action_3.action_3"><option value="" ></option><option value="create" >create</option><option value="read" >read</option><option value="update" >update</option><option value="delete" >delete</option><option value="change_permissions" >change_permissions</option></select>
<select id="rules.target_3.target_3" name="rules.target_3.target_3"><option value="" ></option><option value="posts" >posts</option><option value="users" >users</option><option value="roles" >roles</option></select>
<select id="rules.owner_3.owner_3" name="rules.owner_3.owner_3"><option value="" ></option><option value="SELF" >SELF</option><option value="ALL" >ALL</option><option value="user" >user</option></select>
<enhance-text-input label="Id_3" type="text" id="rules.id_3" name="rules.id_3" value="\${role?.rules?.id_3}" errors="\${problems?.rules?.id_3?.errors}"></enhance-text-input>

<select id="rules.action_4.action_4" name="rules.action_4.action_4"><option value="" ></option><option value="create" >create</option><option value="read" >read</option><option value="update" >update</option><option value="delete" >delete</option><option value="change_permissions" >change_permissions</option></select>
<select id="rules.target_4.target_4" name="rules.target_4.target_4"><option value="" ></option><option value="posts" >posts</option><option value="users" >users</option><option value="roles" >roles</option></select>
<select id="rules.owner_4.owner_4" name="rules.owner_4.owner_4"><option value="" ></option><option value="SELF" >SELF</option><option value="ALL" >ALL</option><option value="user" >user</option></select>
<enhance-text-input label="Id_4" type="text" id="rules.id_4" name="rules.id_4" value="\${role?.rules?.id_4}" errors="\${problems?.rules?.id_4?.errors}"></enhance-text-input>

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
