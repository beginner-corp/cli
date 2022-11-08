let manifest = {
  sourceFiles: [
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
}

module.exports = manifest
