module.exports = async function generate (params, args) {
  let { manifest, replacements, utils, command, project } = args
  let { addElements, addRouteSource } = require('./utils')
  let { installDependencies } = require('../../../../lib/npm-commands')
  let { mutateArc, writeFile } = utils
  let { arcMutations = [], elements = [], dependencies = [], devDependencies = [] } = manifest
  let raw = project.raw

  // Install Dependencies
  await installDependencies(params, dependencies)
  await installDependencies(params, devDependencies, true)

  // Mutate Arc File
  arcMutations.forEach(mutation => {
    raw = mutateArc.upsert({ ...mutation,  raw })
  })

  // Write the arcfile to disk
  writeFile(project.manifest, raw)

  // Write elements
  addElements(elements, writeFile)

  // Copy source code
  addRouteSource({ manifest, replacements, writeFile, command })
}
