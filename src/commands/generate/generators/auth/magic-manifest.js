const manifest = {
  arcMutations: [
    { pragma: 'bundles', item: 'magic-ws src/auth/client/magic-ws.mjs' },
    { pragma: 'ws', item: '#web sockets' },
    { pragma: 'events', item: 'auth-link' },
  ],
  sourceFiles: [
    // API
    { src: 'handlers/magic/api/auth/example.js', target: 'app/api/auth/example.mjs' },
    { src: 'handlers/magic/api/auth/login.js', target: 'app/api/auth/login.mjs' },
    { src: 'handlers/magic/api/auth/signup.js', target: 'app/api/auth/signup.mjs' },
    { src: 'handlers/magic/api/auth/register.js', target: 'app/api/auth/register.mjs' },
    { src: 'handlers/magic/api/auth/logout.js', target: 'app/api/auth/logout.mjs' },
    { src: 'handlers/magic/api/auth/verify.js', target: 'app/api/auth/verify.mjs' },
    { src: 'handlers/magic/api/auth/wait.js', target: 'app/api/auth/wait.mjs' },
    { src: 'handlers/magic/api/auth/welcome.js', target: 'app/api/auth/welcome.mjs' },
    // Pages
    { src: 'handlers/magic/pages/auth/example.js', target: 'app/pages/auth/example.mjs' },
    { src: 'handlers/magic/pages/auth/login.js', target: 'app/pages/auth/login.html' },
    { src: 'handlers/magic/pages/auth/signup.js', target: 'app/pages/auth/signup.html' },
    { src: 'handlers/magic/pages/auth/register.js', target: 'app/pages/auth/register.mjs' },
    { src: 'handlers/magic/pages/auth/verify.js', target: 'app/pages/auth/verify.html' },
    { src: 'handlers/magic/pages/auth/wait.js', target: 'app/pages/auth/wait.mjs' },
    { src: 'handlers/magic/pages/auth/welcome.js', target: 'app/pages/auth/welcome.mjs' },
    // Shared code (inside models directory)
    {
      src: 'handlers/magic/models/auth/helpers/can-i.js', target: 'models/auth/helpers/can-i.mjs' },
    // Events
    { src: 'handlers/magic/events/auth-link/index.js', target: 'src/events/auth-link/index.mjs' },
    // Other Src
    { src: 'handlers/magic/public/magic-ws.js', target: 'src/auth/client/magic-ws.mjs' },
    // Web Socket
    { src: 'handlers/magic/ws/connect/index.js', target: 'src/ws/connect/index.js' },
    { src: 'handlers/magic/ws/default/index.js', target: 'src/ws/default/index.js' },
    { src: 'handlers/magic/ws/disconnect/index.js', target: 'src/ws/disconnect/index.js' },
    // Seed database
    { src: 'handlers/magic/scripts/seed-users.js', target: 'scripts/seed-users.mjs' },
    // Users and Roles
    // TODO: These files are sectioned under tmp-users for now. It needs to be refactored because it duplicates a lot from generate scaffold
    { src: 'handlers/magic/tmp-users/app/api/roles.js', target: 'app/api/roles.mjs' },
    { src: 'handlers/magic/tmp-users/app/api/roles/$id.js', target: 'app/api/roles/$id.mjs' },
    { src: 'handlers/magic/tmp-users/app/api/roles/$id/delete.js', target: 'app/api/roles/$id/delete.mjs' },
    { src: 'handlers/magic/tmp-users/app/api/users.js', target: 'app/api/users.mjs' },
    { src: 'handlers/magic/tmp-users/app/api/users/$id.js', target: 'app/api/users/$id.mjs' },
    { src: 'handlers/magic/tmp-users/app/api/users/$id/delete.js', target: 'app/api/users/$id/delete.mjs' },
    { src: 'handlers/magic/tmp-users/app/pages/roles.js', target: 'app/pages/roles.mjs' },
    { src: 'handlers/magic/tmp-users/app/pages/roles/$id.js', target: 'app/pages/roles/$id.mjs' },
    { src: 'handlers/magic/tmp-users/app/pages/users.js', target: 'app/pages/users.mjs' },
    { src: 'handlers/magic/tmp-users/app/pages/users/$id.js', target: 'app/pages/users/$id.mjs' },
    { src: 'handlers/magic/tmp-users/app/schemas/role.js', target: 'app/schemas/role.mjs' },
    { src: 'handlers/magic/tmp-users/app/schemas/registration.js', target: 'app/schemas/registration.mjs' },
    { src: 'handlers/magic/tmp-users/app/schemas/user.js', target: 'app/schemas/user.mjs' },
    { src: 'handlers/magic/tmp-users/models/registration.js', target: 'models/registration.mjs' },
    { src: 'handlers/magic/tmp-users/models/roles.js', target: 'models/roles.mjs' },
    { src: 'handlers/magic/tmp-users/models/users.js', target: 'models/users.mjs' },
  ],
  elements: [
    { name: 'FieldSet', package: '@enhance/form-elements', tagName: 'enhance-fieldset' },
    { name: 'FormElement', package: '@enhance/form-elements', tagName: 'enhance-form' },
    { name: 'LinkElement', package: '@enhance/form-elements', tagName: 'enhance-link' },
    { name: 'PageContainer', package: '@enhance/form-elements', tagName: 'enhance-page-container' },
    { name: 'SubmitButton', package: '@enhance/form-elements', tagName: 'enhance-submit-button' },
    { name: 'TextInput', package: '@enhance/form-elements', tagName: 'enhance-text-input' }
  ],
  dependencies: [
    '@begin/validator@0.0.9',
    'github:enhance-dev/form-elements'
  ]
}

module.exports = manifest
