
let { mkdirSync } = require('fs')

function addRouteSource ({ manifest, routeName = '', replacements = {}, writeFile, command }) {
  let path = require('path')
  const { sourceFiles } = manifest
  sourceFiles.forEach(file => {
    let dirname = path.dirname(file.target).replace('<ROUTE_NAME>', routeName)
    mkdirSync(dirname, { recursive: true })
    // eslint-disable-next-line
    let source = require(`./generators/${command}/${file.src}`)
    writeFile(file.target.replace('<ROUTE_NAME>', routeName), source(replacements))
  })
}

module.exports = {
  addRouteSource
}
