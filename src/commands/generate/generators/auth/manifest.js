const manifest = {
  arcMutations: [
    { pragma: 'plugins', item: 'arc-plugin-oauth' },
    { pragma: 'oauth', item: 'use-mock true' },
    { pragma: 'oauth', item: 'mock-list auth/mock-allow.mjs' },
    { pragma: 'oauth', item: 'allow-list auth/allow.mjs' },
  ],
  sourceFiles: [
    // Utils
    { src: 'handlers/allow.js', target: 'models/auth/allow.mjs' },
    { src: 'handlers/mock-allow.js', target: 'models/auth/mock-allow.mjs' },
    // API
    { src: 'handlers/html-api-example.js', target: 'app/api/auth/html-example.mjs' },
    { src: 'handlers/json-api-example.js', target: 'app/api/auth/json-example.mjs' },
    // Pages
    { src: 'handlers/html-page-example.js', target: 'app/pages/auth/html-example.mjs' },
  ],
  elements: [
  ],
  dependencies: [
    'arc-plugin-oauth'
  ]
}

module.exports = manifest
