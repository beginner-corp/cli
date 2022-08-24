module.exports = function () {
  return `import db from '@begin/data'
import arc  from '@architect/functions'
export async function get(req){
  const magicVerifyId = req.query.magic
  const sessionInfo = await db.get({table:'session', key: magicVerifyId })
  //1. Verify query param is valid
  //2. Change DB session to verified
  if (sessionInfo) {
    await db.set({table:'session',...sessionInfo, key:sessionInfo.magicId, verified:true})
  }
  //3. Send WS message to the waiting session
  try {
    const connectionId = (await db.get({table:'session',key:sessionInfo.magicQueryId})).connectionId
    await arc.ws.send({id:connectionId,payload:{verified:true}})
  } catch (e) { }
  //4. Show that session is verified and screen can be closed
  return {
    html:'<h1> Verified</h1><br/><p>You are logged in. You can close this window</p>'
  }
}`
}
