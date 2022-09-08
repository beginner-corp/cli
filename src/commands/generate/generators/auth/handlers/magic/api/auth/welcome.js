module.exports = function () {
  return `import canI from '../../../models/auth/can-i.mjs'

export async function get (req) {
  const authenticated = canI(req)
  if (authenticated) {
    return {
      json: { account: authenticated }
    }
  }
  else {
    return {
      location: '/'
    }
  }
}
`
}
