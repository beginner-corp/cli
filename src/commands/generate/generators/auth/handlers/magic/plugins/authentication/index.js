module.exports = function () {
  return /* javascript*/`
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
      let customRoutes = join(__dirname, 'routes')
      return [
        {
          method: 'any',
          path: '/auth/*',
          src: join(customRoutes, 'any-auth-catchall'),
          config: {
            // shared: false,
            views: true,
          }
        },
        {
          method: 'any',
          path: '/login',
          src: join(customRoutes, 'any-login'),
          config: {
            // shared: false,
            views: true,
          }
        },
        {
          method: 'any',
          path: '/signup',
          src: join(customRoutes, 'any-signup'),
          config: {
            // shared: false,
            views: true,
          }
        },
        {
          method: 'post',
          path: '/logout',
          src: join(customRoutes, 'post-logout'),
          config: {
            // shared: false,
            views: true,
          }
        },
      ]
    }

  }
}

  `
}
