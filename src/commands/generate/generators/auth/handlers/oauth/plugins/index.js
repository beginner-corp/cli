module.exports = function (){
  return `let { join } = require('path')
module.exports = {
  set: {
    http: function ({ arc, inventory }) {
      const specificRoutes = arc.oauth.find((i) => i[0] === 'routes') || false
      const useMock = arc.oauth.find((i) => i[0] === 'use-mock')?.[1]
      let endpoints = []
      if (!specificRoutes || specificRoutes.includes('auth'))
        endpoints.push({
          method: 'get',
          path: '/auth',
          config: { views: true },
          src: join(__dirname, 'routes', 'get-auth')
        })
      if (!specificRoutes || specificRoutes.includes('logout'))
        endpoints.push({
          method: 'post',
          path: '/logout',
          config: { views: true },
          src: join(__dirname, 'routes', 'post-logout')
        })
      if (!specificRoutes || specificRoutes.includes('login'))
        endpoints.push({
          method: 'get',
          path: '/login',
          config: { views: true },
          src: join(__dirname,  'routes', 'get-login')
        })
      if (useMock && !inventory.inv?._arc?.deployStage)
        endpoints.push({
          method: 'any',
          path: '/mock/auth/:part',
          config: { views: true },
          src: join(__dirname,  'routes', 'get-mock-auth-000part')
        })

      return endpoints
    }
  },

  deploy: {
    services: async ({ arc, /* cloudformation, dryRun, inventory, */ stage }) => {
      const isLocal = stage === 'testing'
      const afterAuthRedirect = arc.oauth.find(
        (i) => i[0] === 'after-auth-redirect'
      )?.[1]
      const customAuthorize = arc.oauth.find(
        (i) => i[0] === 'custom-authorize'
      )?.[1]
      const unAuthRedirect = arc.oauth.find(
        (i) => i[0] === 'un-auth-redirect'
      )?.[1]
      const matchProperty =
        arc.oauth.find((i) => i[0] === 'match-property')?.[1] || 'login'
      const includeProperties = arc.oauth.find(
        (i) => i[0] === 'include-properties'
      )
        ? JSON.stringify(
          arc.oauth.find((i) => i[0] === 'include-properties').slice(1)
        )
        : [ matchProperty ]
      const useMock = arc.oauth.find((i) => i[0] === 'use-mock')?.[1]
      const mockAllowList = arc.oauth.find((i) => i[0] === 'mock-list')
        ? arc.oauth.find((i) => i[0] === 'mock-list')[1]
        : 'mock-allow.mjs'
      const useAllowList = arc.oauth.find((i) => i[0] === 'allow-list')
      const allowList = useAllowList
        ? arc.oauth.find((i) => i[0] === 'allow-list')?.[1]
        : ''
      const testing = {
        ARC_OAUTH_AFTER_AUTH: afterAuthRedirect ? afterAuthRedirect : '/',
        ARC_OAUTH_CUSTOM_AUTHORIZE: customAuthorize ? customAuthorize : '',
        ARC_OAUTH_UN_AUTH_REDIRECT: unAuthRedirect ? unAuthRedirect : '/login',
        ARC_OAUTH_INCLUDE_PROPERTIES: includeProperties,
        ARC_OAUTH_MATCH_PROPERTY: matchProperty,
        ARC_OAUTH_USE_MOCK: useMock ? 'true' : '',
        ARC_OAUTH_USE_ALLOW_LIST: useAllowList ? 'true' : '',
        ARC_OAUTH_ALLOW_LIST: allowList,
        ARC_OAUTH_AUTH_URI: 'http://localhost:3333/auth',
        ARC_OAUTH_TOKEN_URI: 'https://github.com/login/oauth/access_token',
        ARC_OAUTH_USER_INFO_URI: 'https://api.github.com/user'
      }
      if (useMock) {
        testing.ARC_OAUTH_TOKEN_URI = 'http://localhost:3333/mock/auth/token'
        testing.ARC_OAUTH_CODE_URI = 'http://localhost:3333/mock/auth/code'
        testing.ARC_OAUTH_USER_INFO_URI = 'http://localhost:3333/mock/auth/user'
        testing.ARC_OAUTH_MOCK_ALLOW_LIST = mockAllowList
      }

      if (isLocal) return { config: JSON.stringify(testing) }

      return {
        config: JSON.stringify({
          ARC_OAUTH_INCLUDE_PROPERTIES: includeProperties,
          ARC_OAUTH_CUSTOM_AUTHORIZE: customAuthorize ? customAuthorize : '',
          ARC_OAUTH_MATCH_PROPERTY: matchProperty,
          ARC_OAUTH_AFTER_AUTH: afterAuthRedirect ? afterAuthRedirect : '/',
          ARC_OAUTH_UN_AUTH_REDIRECT: unAuthRedirect
            ? unAuthRedirect
            : '/login',
          ARC_OAUTH_USE_ALLOW_LIST: useAllowList ? 'true' : '',
          ARC_OAUTH_ALLOW_LIST: allowList,
          ARC_OAUTH_TOKEN_URI: 'https://github.com/login/oauth/access_token',
          ARC_OAUTH_USER_INFO_URI: 'https://api.github.com/user'
        })
      }

    }
  }



}

`
}
