const manifest = {
  arcMutations: [
    {
      pragma: 'events', item: `auth-link
  src jobs/events/auth-link` },
  ],
  sourceFiles: [
    // API
    { src: 'handlers/magic/api/auth/example.js', target: 'app/api/auth/example.mjs' },
    { src: 'handlers/magic/api/auth/login.js', target: 'app/api/auth/login.mjs' },
    { src: 'handlers/magic/api/auth/signup.js', target: 'app/api/auth/signup.mjs' },
    { src: 'handlers/magic/api/auth/register.js', target: 'app/api/auth/register.mjs' },
    { src: 'handlers/magic/api/auth/logout.js', target: 'app/api/auth/logout.mjs' },
    { src: 'handlers/magic/api/auth/verify.js', target: 'app/api/auth/verify.mjs' },
    { src: 'handlers/magic/api/auth/welcome.js', target: 'app/api/auth/welcome.mjs' },
    // Pages
    { src: 'handlers/magic/pages/auth/example.js', target: 'app/pages/auth/example.mjs' },
    { src: 'handlers/magic/pages/auth/login.js', target: 'app/pages/auth/login.html' },
    { src: 'handlers/magic/pages/auth/signup.js', target: 'app/pages/auth/signup.html' },
    { src: 'handlers/magic/pages/auth/register.js', target: 'app/pages/auth/register.mjs' },
    { src: 'handlers/magic/pages/auth/verify.js', target: 'app/pages/auth/verify.html' },
    { src: 'handlers/magic/pages/auth/welcome.js', target: 'app/pages/auth/welcome.mjs' },
    // Shared code (inside models directory)
    { src: 'handlers/magic/models/auth/can-i.js', target: 'app/models/auth/can-i.mjs' },
    // Events
    { src: 'handlers/magic/events/auth-link/index.js', target: 'jobs/events/auth-link/index.mjs' },
    // Seed database
    { src: 'handlers/magic/scripts/seed-users.js', target: 'scripts/seed-users.js' },
    // Users Table
    // Utils
    { src: '../scaffold/handlers/model.js', target: 'app/models/<ROUTE_NAME>.mjs' },
    // API
    { src: '../scaffold/handlers/api-create-list.js', target: 'app/api/<ROUTE_NAME>.mjs' },
    { src: '../scaffold/handlers/api-delete.js', target: 'app/api/<ROUTE_NAME>/$id/delete.mjs' },
    { src: '../scaffold/handlers/api-read-update.js', target: 'app/api/<ROUTE_NAME>/$id.mjs' },
    // Pages
    { src: '../scaffold/handlers/pages-list.js', target: 'app/pages/<ROUTE_NAME>.mjs' },
    { src: '../scaffold/handlers/pages-read.js', target: 'app/pages/<ROUTE_NAME>/$id.mjs' },
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
    'github:enhance-dev/form-elements'
  ]
}

module.exports = manifest
