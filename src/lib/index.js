let getRelativeCwd = require('./get-relative-cwd')

let httpMethods = [ 'get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'any' ]

let runtimes = [ 'node', 'deno', 'ruby', 'python' ]

let backtickify = a => a.map(s => '`' + s + '`').join(', ')

let mutateArc = require('./mutate-arc')

let writeFile = require('./write-file')

module.exports = {
  backtickify,
  getRelativeCwd,
  httpMethods,
  mutateArc,
  runtimes,
  writeFile,
}
