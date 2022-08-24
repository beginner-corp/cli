const manifest = {
  arcMutations: [
    { pragma: 'plugins', item: 'arc-plugin-oauth' },
    { pragma: 'oauth', item: 'use-mock true' },
    { pragma: 'oauth', item: 'mock-list auth/mock-allow.mjs' },
    { pragma: 'oauth', item: 'allow-list auth/allow.mjs' },
  ],
  sourceFiles: [
    // Utils
    { src: 'handlers/oauth/allow.js', target: 'models/auth/allow.mjs' },
    { src: 'handlers/oauth/mock-allow.js', target: 'models/auth/mock-allow.mjs' },
    // API
    { src: 'handlers/oauth/html-api-example.js', target: 'app/api/auth/html-example.mjs' },
    { src: 'handlers/oauth/json-api-example.js', target: 'app/api/auth/json-example.mjs' },
    // Pages
    { src: 'handlers/oauth/html-page-example.js', target: 'app/pages/auth/html-example.mjs' },
  ],
  elements: [
  ],
  dependencies: [
    'arc-plugin-oauth'
  ]
}

module.exports = manifest
