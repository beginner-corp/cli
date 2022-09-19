const manifest = {
  arcMutations: [],
  sourceFiles: [
    // Utils
    { src: 'handlers/model.js', target: 'app/models/<ROUTE_NAME>.mjs' },
    // API
    { src: 'handlers/api-create-list.js', target: 'app/api/<ROUTE_NAME>.mjs' },
    { src: 'handlers/api-delete.js', target: 'app/api/<ROUTE_NAME>/$id/delete.mjs' },
    { src: 'handlers/api-read-update.js', target: 'app/api/<ROUTE_NAME>/$id.mjs' },
    // Pages
    { src: 'handlers/pages-list.js', target: 'app/pages/<ROUTE_NAME>.mjs' },
    { src: 'handlers/pages-read.js', target: 'app/pages/<ROUTE_NAME>/$id.mjs' },
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
