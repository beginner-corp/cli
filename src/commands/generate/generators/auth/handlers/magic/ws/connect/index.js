module.exports = function () {
  return `/**
 * notes:
 * - verify event.headers.Origin to enforce same-origin
 * - non 200 response will disconnect the client socket
 */
exports.handler = async function ws(event) {
  return {statusCode: 200}
}`
}


