module.exports = function () {
  return `/**
 * used to clean up event.requestContext.connectionId
 */
exports.handler = async function ws(event) {
  return {statusCode: 200}
}`
}
