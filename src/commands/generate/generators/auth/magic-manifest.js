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
    { src: 'handlers/magic/api/auth/verify.js', target: 'app/api/auth/verify.mjs' },
    { src: 'handlers/magic/api/auth/wait.js', target: 'app/api/auth/wait.mjs' },
    // Pages
    { src: 'handlers/magic/pages/auth/example.js', target: 'app/pages/auth/example.mjs' },
    { src: 'handlers/magic/pages/auth/login.js', target: 'app/pages/auth/login.html' },
    // { src: 'handlers/magic/pages/auth/verify.js', target: 'app/pages/auth/verify.mjs' },
    { src: 'handlers/magic/pages/auth/wait.js', target: 'app/pages/auth/wait.mjs' },
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
  ],
  elements: [
  ],
}

module.exports = manifest
