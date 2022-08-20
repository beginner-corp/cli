const { addElements, addRouteSource } = require('./utils')
const { installDependencies } = require('../../../../lib/npm-commands')

module.exports = async function generate ({ manifest, routeName, replacements, utils, command, project }) {
  const { mutateArc, writeFile } = utils
  const { arcMutations = [], elements = [], dependencies = [] } = manifest
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
  addRouteSource({ manifest, routeName, replacements, writeFile, command })
}
