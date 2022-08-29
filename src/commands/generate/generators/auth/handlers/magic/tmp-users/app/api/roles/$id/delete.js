module.exports = function () {
  return `// View documentation at: https://docs.begin.com
import { deleteRole } from '../../../../models/roles.mjs'
import canI from '../../../../models/auth/helpers/can-i.mjs'

export async function post (req) {
  const id = req.pathParameters?.id

  const iCan = canI( req, { role: 'admin' } )
  if (iCan) {

    try {
      await deleteRole(id)
      return {
        session: {},
        json: null,
        location: '/roles'
      }
    }
    catch (err) {
      return {
        session: { error: err.message },
        json: { error: err.message },
        location: '/roles'
      }
    }
  } else {
    return {
      statusCode:401
    }
  }
}
`
}
