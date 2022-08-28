module.exports = function () {
  return `import db from '@begin/data'
await db.set({ table: 'users', key: 'u1', email: 'admin@example.com', firstname: 'Jane', lastname: 'Doe', roles: { role1: 'admin', role2: '', role3: '' } })
await db.set({ table: 'users', key: 'u2', email: 'member@example.com', firstname: 'John', lastname: 'Smith', roles: { role1: 'member', role2: '', role3: '' } })
await db.set({ table: 'roles', key: 'r1', name: 'admin', description: '', rules: { 
  action_1: 'read', target_1: 'users', owner_1: 'ALL', id_1: '', 
  action_2: 'update', target_2: 'users', owner_2: 'ALL', id_2: '', 
} })
await db.set({ table: 'roles', key: 'r2', name: 'member', description: '', rules: { 
  action_1: 'read', target_1: 'tasks', owner_1: 'SELF', id_1: '', 
  action_2: 'update', target_2: 'tasks', owner_2: 'SELF', id_2: '', 
} })
`
}
