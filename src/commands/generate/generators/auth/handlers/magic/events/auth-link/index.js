module.exports = function () {
  return `import db from '@begin/data'

export async function handler (event) {
  const payload = JSON.parse(event?.Records?.[0]?.Sns?.Message)
  const { magicId, magicQueryId, magicVerifyId, email } = payload
  await db.set({ table: 'session', key: magicId, magicId, magicQueryId, magicVerifyId, email })
  await db.set({ table: 'session', key: magicVerifyId, magicId, magicQueryId, magicVerifyId, email })
  console.log('Magic Link', \`http://localhost:3333/auth/verify?magic=\${encodeURIComponent(magicVerifyId)}\`)
  return
}
`
}
