module.exports = async function generate ({ manifest, replacements, utils, command, project }) {
  let { addElements, addRouteSource } = require('./utils')
  let { installDependencies } = require('../../../../lib/npm-commands')
  let { mutateArc, writeFile } = utils
  let { arcMutations = [], elements = [], dependencies = [] } = manifest
  let raw = project.raw

  // Install Dependencies
  installDependencies(dependencies)

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
