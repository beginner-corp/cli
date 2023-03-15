let manifest = {
  arcMutations: [
    // { pragma: 'plugins', item: 'authentication' },
    { pragma: 'plugins', item: '\nauthentication\n  src plugins/authentication' },
  ],
  sourceFiles: [
    // Plugin
    { src: 'handlers/magic/plugins/authentication/index.js', target: 'plugins/authentication/index.js' },
    { src: 'handlers/magic/plugins/authentication/routes/index.js', target: 'plugins/authentication/routes/any-auth-catchall/index.mjs' },
    { src: 'handlers/magic/plugins/authentication/routes/index.js', target: 'plugins/authentication/routes/any-login/index.mjs' },
    { src: 'handlers/magic/plugins/authentication/routes/index.js', target: 'plugins/authentication/routes/post-logout/index.mjs' },
    { src: 'handlers/magic/plugins/authentication/routes/index.js', target: 'plugins/authentication/routes/any-signup/index.mjs' },


    { src: 'handlers/common/api/example-auth.js', target: 'app/api/example-auth.mjs' },
    { src: 'handlers/common/pages/example-auth.js', target: 'app/pages/example-auth.mjs' },
    // API
    { src: 'handlers/magic/api/login.js', target: 'plugins/authentication/routes/any-login/api/login.mjs' },
    { src: 'handlers/magic/api/signup.js', target: 'plugins/authentication/routes/any-signup/api/signup.mjs' },
    { src: 'handlers/magic/api/logout.js', target: 'plugins/authentication/routes/post-logout/api/logout.mjs' },
    { src: 'handlers/magic/api/auth/register.js', target: 'plugins/authentication/routes/any-auth-catchall/api/auth/register.mjs' },
    // { src: 'handlers/magic/api/example-auth.js', target: 'app/api/example-auth.mjs' },
    { src: 'handlers/magic/api/auth/verify.js', target: 'plugins/authentication/routes/any-auth-catchall/api/auth/verify.mjs' },
    { src: 'handlers/magic/api/auth/welcome.js', target: 'plugins/authentication/routes/any-auth-catchall/api/auth/welcome.mjs' },
    // Pages
    // { src: 'handlers/magic/pages/example-auth.js', target: 'app/pages/example-auth.mjs' },
    { src: 'handlers/magic/pages/login.js', target: 'plugins/authentication/routes/any-login/pages/login.html' },
    { src: 'handlers/magic/pages/signup.js', target: 'plugins/authentication/routes/any-signup/pages/signup.html' },
    { src: 'handlers/magic/pages/auth/register.js', target: 'plugins/authentication/routes/any-auth-catchall/pages/auth/register.mjs' },
    { src: 'handlers/magic/pages/auth/verify.js', target: 'plugins/authentication/routes/any-auth-catchall/pages/auth/verify.html' },
    { src: 'handlers/magic/pages/auth/welcome.js', target: 'plugins/authentication/routes/any-auth-catchall/pages/auth/welcome.mjs' },
    // Shared code (inside models directory)
    { src: 'handlers/common/models/auth/auth-check.js', target: 'app/models/auth/auth-check.mjs' },
    { src: 'handlers/common/models/auth/allow-list.js', target: 'app/models/auth/allow-list.mjs' },
    // Events
    { src: 'handlers/magic/plugins/authentication/events/auth-link/index.js', target: 'plugins/authentication/jobs/auth-link/index.mjs' },
    // Seed database
    { src: 'handlers/common/scripts/seed-accounts.js', target: 'scripts/seed-accounts.js' },
  ],
  dependencies: [
    'github:ryanbethel/arc-plugin-enhance#router-export'
  ]
}

module.exports = manifest
