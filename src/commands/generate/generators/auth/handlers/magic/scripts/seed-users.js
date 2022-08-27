module.exports = function () {
  return `import db from '@begin/data'
await db.set({ table: 'users', key: 'u1', email: 'admin@example.com', firstname: 'Jane', lastname: 'Doe', roles: { role1: 'admin', role2: '', role3: '' } })
await db.set({ table: 'users', key: 'u2', email: 'member@example.com', firstname: 'John', lastname: 'Smith', roles: { role1: 'member', role2: '', role3: '' } })
await db.set({ table: 'roles', key: 'r1', name: 'admin', description: '', rules: { 
  action1: 'read', target1: 'users', owner1: 'ALL', id1: '', 
  action2: 'update', target2: 'users', owner2: 'ALL', id2: '', 
} })
await db.set({ table: 'roles', key: 'r2', name: 'member', description: '', rules: { 
  action1: 'read', target1: 'tasks', owner1: 'SELF', id1: '', 
  action2: 'update', target2: 'tasks', owner2: 'SELF', id2: '', 
} })
`
}
