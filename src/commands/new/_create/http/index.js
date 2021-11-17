let { runtimes, runtimeVersions } = require('lambda-runtimes')

module.exports = async function http (params) {
  let { method, path, src } = params
  let { getRelativeCwd } = require('../../../../lib')

  let item = `${method} ${path}`
  if (src) {
    src = getRelativeCwd(src)
    item = `${path}
  method ${method}
  src ${src}`
  }

  return addItem({ ...params, pragma: 'http', method, path, item, src })
}

async function addItem (params) {
  let { inventory, item, lang, method, path, pragma, runtime } = params
  let { _project } = inventory.inv

  let { mkdirSync, existsSync, writeFileSync } = require('fs')
  let { join } = require('path')
  let _inventory = require('@architect/inventory')
  let printer = require('../../../../printer')
  let { getRelativeCwd, mutateArc } = require('../../../../lib')
  let errors = require('./errors')
  let handlers = require('./handlers')

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
  let route = inventory.get.http(`${method} ${path}`)
  let { configFile, handlerFile, src } = route

  // Inv API note: configFile is null if file !exists; handlerFile is always present
  if (existsSync(handlerFile)) {
    return errors(lang, 'found_file', handlerFile)
  }
  if (customRuntime && configFile) {
    return errors(lang, 'found_file', configFile)
  }

  // Write new Arc file
  writeFileSync(_project.manifest, arc)
  let messages = require('./messages')
  printer.verbose(params, messages[lang].wrote_file('app.arc manifest'))

  // Write the function handler
  let handler = handlers[runtime](lang, getRelativeCwd(handlerFile))
  mkdirSync(src, { recursive: true })
  writeFileSync(handlerFile, handler)
  let msg = `HTTP function handler at ${getRelativeCwd(handlerFile)}`
  printer.verbose(params, messages[lang].wrote_file(msg))

  // If not the default runtime, write a config.arc file
  if (customRuntime) {
    let arcConfig = `@aws\nruntime ${runtime}\n`
    let configFile = join(src, 'config.arc')
    writeFileSync(configFile, arcConfig)
    let msg = `function config at ${getRelativeCwd(configFile)}`
    printer.verbose(params, messages[lang].wrote_file(msg))
  }
}
