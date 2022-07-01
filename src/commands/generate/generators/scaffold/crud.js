const crud = {
  routes: [
    'get /<ROUTE_NAME>',
    'get /<ROUTE_NAME>/new',
    'get /<ROUTE_NAME>/:id',
    'post /<ROUTE_NAME>',
    'post /<ROUTE_NAME>/:id',
    'post /<ROUTE_NAME>/:id/delete'
  ],
  sourceFiles: [
    // Utils
    { src: './crud/schema-to-form.js', target: 'src/views/schema-to-form.mjs' },
    { src: './crud/model.js', target: 'src/shared/db/<ROUTE_NAME>.mjs' },
    // List
    { src: './crud/index.js', target: 'src/http/get-<ROUTE_NAME>/index.mjs' },
    { src: './crud/list-json.js', target: 'src/http/get-<ROUTE_NAME>/json.mjs' },
    { src: './crud/list-html.js', target: 'src/http/get-<ROUTE_NAME>/html.mjs' },
    // New
    { src: './crud/new-index.js', target: 'src/http/get-<ROUTE_NAME>-new/index.mjs' },
    { src: './crud/new-html.js', target: 'src/http/get-<ROUTE_NAME>-new/html.mjs' },
    // Get
    { src: './crud/index.js', target: 'src/http/get-<ROUTE_NAME>-000id/index.mjs' },
    { src: './crud/read-json.js', target: 'src/http/get-<ROUTE_NAME>-000id/json.mjs' },
    { src: './crud/read-html.js', target: 'src/http/get-<ROUTE_NAME>-000id/html.mjs' },
    // Create
    { src: './crud/create-index.js', target: 'src/http/post-<ROUTE_NAME>/index.mjs' },
    { src: './crud/create-validate.js', target: 'src/http/post-<ROUTE_NAME>/validate.mjs' },
    { src: './crud/create-json.js', target: 'src/http/post-<ROUTE_NAME>/json.mjs' },
    { src: './crud/create-html.js', target: 'src/http/post-<ROUTE_NAME>/html.mjs' },
    // Update
    { src: './crud/upsert-index.js', target: 'src/http/post-<ROUTE_NAME>-000id/index.mjs' },
    { src: './crud/upsert-validate.js', target: 'src/http/post-<ROUTE_NAME>-000id/validate.mjs' },
    { src: './crud/upsert-json.js', target: 'src/http/post-<ROUTE_NAME>-000id/json.mjs' },
    { src: './crud/upsert-html.js', target: 'src/http/post-<ROUTE_NAME>-000id/html.mjs' },
    // Delete
    { src: './crud/index.js', target: 'src/http/post-<ROUTE_NAME>-000id-delete/index.mjs' },
    { src: './crud/delete-json.js', target: 'src/http/post-<ROUTE_NAME>-000id-delete/json.mjs' },
    { src: './crud/delete-html.js', target: 'src/http/post-<ROUTE_NAME>-000id-delete/html.mjs' },
  ],
  dependencies: [
    '@architect/functions',
    'nanoid',
    '@begin/validator'
  ]
}

module.exports = crud
