let { sep } = require('path')
module.exports = function getRelativeCwd (path) {
  path = path.replace(process.cwd(), '')
  path = path.startsWith(sep) ? path.substr(1) : path
  return path
}
