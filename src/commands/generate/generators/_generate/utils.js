function addRouteSource ({ manifest, replacements = {}, writeFile, command }) {
  let { mkdirSync } = require('fs')
  let { dirname } = require('path')
  let { routeName = '' } = replacements
  let { sourceFiles } = manifest
  sourceFiles.forEach(file => {
    let dir = dirname(file.target).replace('<ROUTE_NAME>', routeName)
    mkdirSync(dir, { recursive: true })
    // eslint-disable-next-line
    let source = require(`../${command}/${file.src}`)
    writeFile(file.target.replace('<ROUTE_NAME>', routeName), source(replacements))
  })
}

function addElements (elements, writeFile) {
  let { mkdirSync } = require('fs')
  let { dirname } = require('path')
  elements.forEach(element => {
    let dir = dirname('app/elements')
    mkdirSync(dir, { recursive: true })
    writeFile(`app/elements/${element.tagName}.mjs`, `import { ${element.name} } from "${element.package}"
export default ${element.name}
`)
  })
}

module.exports = {
  addElements,
  addRouteSource
}
