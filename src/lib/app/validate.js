let looseName = /^[a-z][a-zA-Z0-9-_]+$/
let cannotBeStaging = `Environment name cannot be 'staging'`
let envRequired = 'An environment name is required'
let envInvalid = 'Environment name must be [a-zA-Z0-9-_]'
let supported = [
  'us-west-1',
  'us-west-2',
  'us-east-1',
  'us-east-2',
  'ca-central-1',
  'ap-south-1',
  'ap-northeast-3',
  'ap-northeast-2',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'sa-east-1',
]

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

let validateRegion = {
  arg (name) {
    if (!supported.includes(name))
      throw Error('unsupported_region: ' + name)
  },
  prompt (name) {
    return supported.includes(name)
  }
}

module.exports = {
  validateEnvName,
  validateRegion
}
