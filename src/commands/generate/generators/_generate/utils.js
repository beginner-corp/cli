let { mkdirSync } = require('fs')

function addRouteSource ({ manifest, replacements = {}, writeFile, command }) {
  let path = require('path')
  const { routeName = '' } = replacements
  const { sourceFiles } = manifest
  sourceFiles.forEach(file => {
    let dirname = path.dirname(file.target).replace('<ROUTE_NAME>', routeName)
    mkdirSync(dirname, { recursive: true })
    // eslint-disable-next-line
    let source = require(`../${command}/${file.src}`)
    writeFile(file.target.replace('<ROUTE_NAME>', routeName), source(replacements))
  })
}

function addElements (elements, writeFile) {
  let path = require('path')
  elements.forEach(element => {
    let dirname = path.dirname('app/elements')
    mkdirSync(dirname, { recursive: true })
    writeFile(`app/elements/${element.tagName}.mjs`, `import { ${element.name} } from "${element.package}"
export default ${element.name}
`)
  })
}

module.exports = {
  addElements,
  addRouteSource
}
