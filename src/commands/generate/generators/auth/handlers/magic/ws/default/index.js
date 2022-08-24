module.exports = function (){
  return `let arc = require('@architect/functions')
  let db = require('@begin/data')

/**
 * append a timestamp and echo the message back to the connectionId
 */
exports.handler = async function ws(event) {
  const connectionId = event.requestContext.connectionId
  let magicQueryId = JSON.parse(event.body).magicQueryId
  await db.set({table:'session', key:magicQueryId, connectionId})

  return {statusCode: 200}
}`
}
