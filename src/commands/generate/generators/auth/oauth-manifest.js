let manifest = {
  arcMutations: [
    { pragma: 'plugins', item: 'oauth' },
    { pragma: 'oauth', item: 'use-mock true' },
    { pragma: 'oauth', item: 'mock-list models/auth/mock-allow.mjs' },
    { pragma: 'oauth', item: 'allow-list models/auth/allow.mjs' },
  ],
  sourceFiles: [
    // Utils
    { src: 'handlers/oauth/allow.js', target: 'app/models/auth/allow.mjs' },
    { src: 'handlers/oauth/auth-helpers.js', target: 'app/models/auth/auth-helpers.mjs' },
    { src: 'handlers/oauth/mock-allow.js', target: 'app/models/auth/mock-allow.mjs' },
    // API
    { src: 'handlers/oauth/html-api-example.js', target: 'app/api/auth/html-example.mjs' },
    { src: 'handlers/oauth/json-api-example.js', target: 'app/api/auth/json-example.mjs' },
    // Pages
    { src: 'handlers/oauth/html-page-example.js', target: 'app/pages/auth/html-example.mjs' },

    // Seed database
    { src: 'handlers/oauth/scripts/seed-accounts.js', target: 'scripts/seed-accounts.js' },


    // Plugin
    { src: 'handlers/oauth/plugins/index.js', target: 'src/plugins/oauth/index.js' },
    { src: 'handlers/oauth/plugins/routes/get-auth/index.js', target: 'src/plugins/oauth/routes/get-auth/index.mjs' },
    { src: 'handlers/oauth/plugins/routes/get-auth/authorize.js', target: 'src/plugins/oauth/routes/get-auth/authorize.mjs' },
    { src: 'handlers/oauth/plugins/routes/get-auth/oauth.js', target: 'src/plugins/oauth/routes/get-auth/oauth.mjs' },
    { src: 'handlers/oauth/plugins/routes/get-login/index.js', target: 'src/plugins/oauth/routes/get-login/index.mjs' },
    { src: 'handlers/oauth/plugins/routes/post-logout/index.js', target: 'src/plugins/oauth/routes/post-logout/index.mjs' },
    { src: 'handlers/oauth/plugins/routes/get-mock-auth-000part/index.js', target: 'src/plugins/oauth/routes/get-mock-auth-000part/index.mjs' },
  ],
  elements: [
  ],
  dependencies: [
    'arc-plugin-oauth'
  ]
}

module.exports = manifest
