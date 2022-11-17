module.exports = function () {
  return `import { checkAuth } from '../../models/auth/auth-helpers.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function get(req) {
  const authenticated = checkAuth(req)
  if (authenticated) {
    return {
      json: { account: authenticated }
    }
  } else {
    return {
      session: { redirectAfterAuth: "/auth/html-example" },
      location: "/login"
    }
  }
}`
}
