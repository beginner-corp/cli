const crud = {
  routes: [],
  sourceFiles: [
    // Utils
    { src: './crud/model.js', target: 'app/db/<ROUTE_NAME>.mjs' },
    // API
    { src: './crud/api-create-list.js', target: 'app/api/<ROUTE_NAME>.mjs' },
    { src: './crud/api-delete.js', target: 'app/api/<ROUTE_NAME>/$id/delete.mjs' },
    { src: './crud/api-read-update.js', target: 'app/api/<ROUTE_NAME>/$id.mjs' },
    // Pages
    { src: './crud/pages-list.js', target: 'app/pages/<ROUTE_NAME>.mjs' },
    { src: './crud/pages-read.js', target: 'app/pages/<ROUTE_NAME>/$id.mjs' },
    { src: './crud/pages-new.js', target: 'app/pages/<ROUTE_NAME>/new.mjs' },
  ],
  dependencies: [
    '@begin/validator'
  ]
}

module.exports = crud
