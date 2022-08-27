module.exports = function () {
  return `import crypto from 'crypto'
import arc from '@architect/functions'

export async function get (){}

export async function post (req) {
  const session = req?.session

  const magicId = crypto.randomBytes(20).toString('base64')
  const magicQueryId = crypto.randomBytes(20).toString('base64')
  const magicVerifyId = crypto.randomBytes(20).toString('base64')
  const newSession = { ...session, magicId }

  const email = req?.body?.email

  await arc.events.publish({
    name: 'auth-link',
    payload: { magicId, magicQueryId, magicVerifyId, email },
  })

  return {
    session: newSession,
    location: \`/auth/wait?magic=\${encodeURIComponent(magicQueryId)}\`
  }
}
`
}
