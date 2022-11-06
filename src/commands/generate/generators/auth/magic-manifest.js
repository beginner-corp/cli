let manifest = {
  arcMutations: [
    { pragma: 'plugins', item: 'authentication' },
  ],
  sourceFiles: [
    // Plugin
    { src: 'handlers/magic/plugins/authentication/index.js', target: 'src/plugins/authentication/index.js' },
    { src: 'handlers/magic/plugins/authentication/http/any-auth-catchall/index.js', target: 'src/plugins/authentication/http/any-auth-catchall/index.mjs' },
    // API
    { src: 'handlers/magic/api/auth/example.js', target: 'src/plugins/authentication/http/any-auth-catchall/api/auth/example.mjs' },
    { src: 'handlers/magic/api/auth/login.js', target: 'src/plugins/authentication/http/any-auth-catchall/api/auth/login.mjs' },
    { src: 'handlers/magic/api/auth/signup.js', target: 'src/plugins/authentication/http/any-auth-catchall/api/auth/signup.mjs' },
    { src: 'handlers/magic/api/auth/register.js', target: 'src/plugins/authentication/http/any-auth-catchall/api/auth/register.mjs' },
    { src: 'handlers/magic/api/auth/logout.js', target: 'src/plugins/authentication/http/any-auth-catchall/api/auth/logout.mjs' },
    { src: 'handlers/magic/api/auth/verify.js', target: 'src/plugins/authentication/http/any-auth-catchall/api/auth/verify.mjs' },
    { src: 'handlers/magic/api/auth/welcome.js', target: 'src/plugins/authentication/http/any-auth-catchall/api/auth/welcome.mjs' },
    // Pages
    { src: 'handlers/magic/pages/auth/example.js', target: 'src/plugins/authentication/http/any-auth-catchall/pages/auth/example.mjs' },
    { src: 'handlers/magic/pages/auth/login.js', target: 'src/plugins/authentication/http/any-auth-catchall/pages/auth/login.html' },
    { src: 'handlers/magic/pages/auth/signup.js', target: 'src/plugins/authentication/http/any-auth-catchall/pages/auth/signup.html' },
    { src: 'handlers/magic/pages/auth/register.js', target: 'src/plugins/authentication/http/any-auth-catchall/pages/auth/register.mjs' },
    { src: 'handlers/magic/pages/auth/verify.js', target: 'src/plugins/authentication/http/any-auth-catchall/pages/auth/verify.html' },
    { src: 'handlers/magic/pages/auth/welcome.js', target: 'src/plugins/authentication/http/any-auth-catchall/pages/auth/welcome.mjs' },
    // Shared code (inside models directory)
    { src: 'handlers/magic/models/auth/auth-check.js', target: 'app/models/auth/auth-check.mjs' },
    { src: 'handlers/magic/models/auth/allow-list.js', target: 'app/models/auth/allow-list.mjs' },
    // Events
    { src: 'handlers/magic/plugins/authentication/events/auth-link/index.js', target: 'src/plugins/authentication/events/auth-link/index.mjs' },
    // Seed database
    { src: 'handlers/magic/scripts/seed-users.js', target: 'scripts/seed-users.js' },
    // Users Table
    // Utils
    { src: '../scaffold/handlers/model.js', target: 'app/models/<ROUTE_NAME>.mjs' },
    // API
    { src: '../scaffold/handlers/api-create-list.js', target: 'src/plugins/authentication/http/any-auth-catchall/api/<ROUTE_NAME>.mjs' },
    { src: '../scaffold/handlers/api-delete.js', target: 'src/plugins/authentication/http/any-auth-catchall/api/<ROUTE_NAME>/$id/delete.mjs' },
    { src: '../scaffold/handlers/api-read-update.js', target: 'src/plugins/authentication/http/any-auth-catchall/api/<ROUTE_NAME>/$id.mjs' },
    // Pages
    { src: '../scaffold/handlers/pages-list.js', target: 'src/plugins/authentication/http/any-auth-catchall/pages/<ROUTE_NAME>.mjs' },
    { src: '../scaffold/handlers/pages-read.js', target: 'src/plugins/authentication/http/any-auth-catchall/pages/<ROUTE_NAME>/$id.mjs' },
  ],
  elements: [
    { name: 'CheckBox', package: '@enhance/form-elements', tagName: 'enhance-checkbox' },
    { name: 'FieldSet', package: '@enhance/form-elements', tagName: 'enhance-fieldset' },
    { name: 'FormElement', package: '@enhance/form-elements', tagName: 'enhance-form' },
    { name: 'LinkElement', package: '@enhance/form-elements', tagName: 'enhance-link' },
    { name: 'PageContainer', package: '@enhance/form-elements', tagName: 'enhance-page-container' },
    { name: 'SubmitButton', package: '@enhance/form-elements', tagName: 'enhance-submit-button' },
    { name: 'TextInput', package: '@enhance/form-elements', tagName: 'enhance-text-input' }
  ],
  dependencies: [
    '@begin/validator@0.0.10',
    'github:enhance-dev/form-elements',
    'github:ryanbethel/arc-plugin-enhance#router-export'
  ]
}

module.exports = manifest
