module.exports = async function action (params, utils, command) {
  let project = params.inventory.inv._project
  let generate = require('../_generate')

  let manifest = require('./manifest')

  // Run the generic generator
  generate({ manifest, command, project, utils })
}
