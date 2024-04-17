let looseName = /^[a-z][a-zA-Z0-9-_]+$/
let cannotBeTesting = [
  'Environment name cannot be "testing".',
  'This may conflict with a local testing environment.',
].join('\n')
let envRequired = 'An environment name is required'
let envInvalid = 'Environment name must be [a-zA-Z0-9-_]'

let validateEnvName = {
  arg: name => {
    if (name === 'testing') throw ReferenceError(cannotBeTesting)
    if (!name) throw ReferenceError(envRequired)
    if (!looseName.test(name)) throw ReferenceError(envInvalid)
    return
  },
  prompt: name => {
    if (name === 'testing') return cannotBeTesting
    if (!name) return envRequired
    return looseName.test(name)
  },
}

module.exports = {
  validateEnvName,
}
