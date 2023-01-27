let looseName = /^[a-z][a-zA-Z0-9-_]+$/

let cannotBeStaging = `Environment name cannot be 'staging'`
let envRequired = 'An environment name is required'
let envInvalid = 'Environment name must be [a-zA-Z0-9-_]'

let regions = [ 'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2' ]
let regionRequired = 'A region name is required'
let regionInvalid = `Region must be one of [${regions.toString()}]`

let validateEnvName = {
  arg: name => {
    if (name === 'testing') throw ReferenceError(cannotBeStaging)
    if (!name) throw ReferenceError(envRequired)
    if (!looseName.test(name)) throw ReferenceError(envInvalid)
    return
  },
  prompt: name => {
    if (name === 'testing') return cannotBeStaging
    if (!name) return envRequired
    return looseName.test(name)
  }
}

let validateRegionName = {
  arg: name => {
    if (!name) throw ReferenceError(regionRequired)
    if (!regions.includes(name)) throw ReferenceError(regionInvalid)
    return true
  },
  prompt: name => {
    if (!name) return regionRequired
    if (!regions.includes(name)) return regionInvalid
    return true
  }
}


module.exports = {
  validateEnvName,
  validateRegionName
}
