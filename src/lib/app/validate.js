let looseName = /^[a-z][a-zA-Z0-9-_]+$/
let envRequired = 'An environment name is required'
let envInvalid = 'Environment name must be [a-zA-Z0-9-_]'

let validateEnvName = {
  arg: name => {
    if (!name) throw ReferenceError(envRequired)
    if (!looseName.test(name)) throw ReferenceError(envInvalid)
    return
  },
  prompt: name => {
    if (!name) return envRequired
    return looseName.test(name)
  }
}

module.exports = {
  validateEnvName,
}
