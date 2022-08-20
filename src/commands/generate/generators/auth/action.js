module.exports = async function action (params, utils, command) {
  let { mutateArc, writeFile, npmCommands, addRouteSource } = utils
  let { installDependencies } = npmCommands
  let project = params.inventory.inv._project
  let raw = project.raw
  let manifest = require('./manifest')

  // Install Plugin
  installDependencies(manifest.dependencies)

  // Add plugin pragma and oauth pragma to arc file
  raw = mutateArc.upsert({ pragma: 'plugins', item: 'arc-plugin-oauth',  raw })
  raw = mutateArc.upsert({ pragma: 'oauth', item: 'use-mock true', raw })
  raw = mutateArc.upsert({ pragma: 'oauth', item: 'mock-list auth/mock-allow.mjs',  raw })
  raw = mutateArc.upsert({ pragma: 'oauth', item: 'allow-list auth/allow.mjs', raw })
  // Write the arcfile to disk
  writeFile(project.manifest, raw)

  // Copy source code
  addRouteSource({ manifest, writeFile, command })
}
