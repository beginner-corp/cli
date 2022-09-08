module.exports = function () {
  return `const db = require('@begin/data')
async function main (){
  await db.set({ table: 'users', key: 'u1', email: 'admin@example.com', firstname: 'Jane', lastname: 'Doe', roles: { role1: 'admin', role2: 'member', role3: '' } })
  await db.set({ table: 'users', key: 'u2', email: 'member@example.com', firstname: 'John', lastname: 'Smith', roles: { role1: 'member', role2: '', role3: '' } })
  await db.set({ table: 'roles', key: 'r1', name: 'admin', description: '', rules: {
    action_1: 'create', target_1: 'users', owner_1: 'ALL', id_1: '',
    action_2: 'read', target_2: 'users', owner_2: 'ALL', id_2: '',
    action_3: 'update', target_3: 'users', owner_3: 'ALL', id_3: '',
    action_4: 'delete', target_4: 'users', owner_4: 'ALL', id_4: '',
  } })
  await db.set({ table: 'roles', key: 'r2', name: 'member', description: '', rules: {
    action_1: 'create', target_1: 'tasks', owner_1: 'SELF', id_1: '',
    action_2: 'read', target_2: 'tasks', owner_2: 'SELF', id_2: '',
    action_3: 'update', target_3: 'tasks', owner_3: 'SELF', id_3: '',
    action_4: 'delete', target_4: 'tasks', owner_4: 'SELF', id_4: '',
  } })
}
main()

`
}
