let { sep } = require('path')
function getRelativeCwd (path) {
  path = path.replace(process.cwd(), '')
  path = path.startsWith(sep) ? path.substr(1) : path
  return path
}

let httpMethods = [ 'get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'any' ]

let runtimes = [ 'node', 'deno', 'ruby', 'python' ]

let backtickify = a => a.map(s => '`' + s + '`').join(', ')

let mutateArc = require('./mutate-arc')

module.exports = {
  backtickify,
  getRelativeCwd,
  httpMethods,
  mutateArc,
  runtimes,
}
