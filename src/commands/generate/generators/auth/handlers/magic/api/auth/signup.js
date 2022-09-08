module.exports = function () {
  return `import crypto from 'crypto'
import arc from '@architect/functions'

export async function get (){}

export async function post (req) {
  const session = req?.session

  const sessionToken = crypto.randomBytes(32).toString('base64')
  const verifyToken = crypto.randomBytes(32).toString('base64')
  const { redirectAfterAuth = '/' } = session

  const email = req?.body?.email

  await arc.events.publish({
    name: 'auth-link',
    payload: { sessionToken, verifyToken, email, redirectAfterAuth, newRegistration: true },
  })

  return {
    session: {},
    html: '<div>Check email for link</div>'  }
}
`
}
