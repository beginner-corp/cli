module.exports = function () {
  return `import crypto from 'crypto'
import arc from '@architect/functions'

export async function get(){}

export async function post(req) {
  const session = req?.session

  //1. set magic link temporary session
  const magicId = crypto.randomBytes(10).toString('base64')
  const magicQueryId = crypto.randomBytes(10).toString('base64')
  const magicVerifyId = crypto.randomBytes(10).toString('base64')
  const newSession = {...session, magicId}


  //2. call event to create and send magic link
  const email = req?.body?.email

await arc.events.publish({
  name: 'auth-link',
  payload: { magicId, magicQueryId, magicVerifyId, email },
})

  return {
    session: newSession, 
    location: \`/auth/wait?magic=\${ encodeURIComponent(magicQueryId) }\`
  }
}`
}
