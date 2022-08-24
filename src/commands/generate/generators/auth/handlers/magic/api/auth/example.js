module.exports = function () {
  return `import canI from '../../../models/auth/helpers/can-i.mjs'

export async function get(req) {
    const authenticated = canI(req,'auth')
    if (authenticated) {
      return {
        json: { account: authenticated }
      }
    } else {
      return {
        session:{redirectAfterAuth:"/auth/example"},
        location: "/auth/login"
      }
    }
}`
}
