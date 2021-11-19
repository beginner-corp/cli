let { runtimes, runtimeVersions } = require('lambda-runtimes')

module.exports = async function addItem (params) {
  let { item, lang, name, pragma, runtime, handlers } = params
  let _inventory = require('@architect/inventory')
  let inventory = await _inventory()
  let { _project } = inventory.inv

  let { mkdirSync, existsSync } = require('fs')
  let { join } = require('path')
  let lib = require('../../../../lib')
  let { getRelativeCwd, mutateArc } = lib
  let writeFile = lib.writeFile(params)
  let errors = require('./errors')

  // Determine whether the incoming function needs a config.arc to be set
  let defaultRuntime = _project.defaultFunctionConfig.runtime
  let customRuntime = runtime && !defaultRuntime.includes(runtime) && defaultRuntime !== runtime

  // Select the correct runtime (if not provided by the user)
  if (!runtime) {
    if (runtimes[defaultRuntime] || defaultRuntime === 'deno') runtime = defaultRuntime
    if (runtimeVersions[defaultRuntime]) runtime = runtimeVersions[defaultRuntime].runtime
  }

  let raw = _project.raw
  let arc = mutateArc.upsert({ item, pragma, raw })

  // Lean on Inventory for project validation
  try {
    inventory = await _inventory({ rawArc: arc })
  }
  catch (err) {
    process.exitCode = 1
    let message = err.message
    if (err.ARC_ERRORS) {
      message = err.ARC_ERRORS.errors.join(', ')
    }
    return message
  }

  // Simulate changing the global runtime to get proper handler file path for the new function
  if (customRuntime) {
    let rawArc = mutateArc.upsert({
      item: `runtime ${runtime}`,
      pragma: 'aws',
      raw: arc
    })
    inventory = await _inventory({ rawArc })
  }

  // Ensure there are no file conflicts
  let lambda = inventory.get[pragma](name)
  let { configFile, handlerFile, src } = lambda

  // Inv API note: configFile is null if file !exists; handlerFile is always present
  if (existsSync(handlerFile)) {
    return errors(lang, 'found_file', handlerFile)
  }
  if (customRuntime && configFile) {
    return errors(lang, 'found_file', configFile)
  }

  // Write new Arc file
  writeFile(_project.manifest, arc)

  // Write the function handler
  let handler = handlers[runtime](lang, getRelativeCwd(handlerFile))
  mkdirSync(src, { recursive: true })
  writeFile(handlerFile, handler)

  // If not the default runtime, write a config.arc file
  if (customRuntime) {
    let arcConfig = `@aws\nruntime ${runtime}\n`
    let configFile = join(src, 'config.arc')
    writeFile(configFile, arcConfig)
  }
}
