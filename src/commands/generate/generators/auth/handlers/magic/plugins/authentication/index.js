module.exports = function () {
  return `
  let { join } = require('path')

module.exports = {

  set: {
    events () {
      return [
        {
          name: 'auth-link',
          src: join(__dirname, 'events', 'auth-link')
        }
      ]
    },
    http () {
      let authHandler = join(__dirname, 'http', 'any-auth-catchall')
      return [
        {
          method: 'any',
          path: '/auth/*',
          src: authHandler,
          config: {
            // shared: false,
            views: false,
          }
        },
      ]
    }

  }
}

  `
}
