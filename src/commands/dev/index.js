let names = { en: [ 'dev', 'sandbox', 'start' ] }
let help = require('./help')

async function action (params) {
  let { appVersion, args } = params
  let { checkManifest } = require('../../lib')

  let _inventory = require('@architect/inventory')
  let inventory = await _inventory()
  let manifestErr = checkManifest(inventory)
  if (manifestErr) return manifestErr

  let cli = require('@architect/sandbox/src/cli')
  let { chars } = require('@architect/utils')
  let c = require('picocolors')
  let { debug, verbose } = args

  // TODO: output Sandbox start via printer
  let ver = `Begin dev server (${appVersion})`
  let logLevel = debug ? 'debug' : undefined || verbose ? 'verbose' : undefined
  let quiet = logLevel ? false : true

  if (!quiet) {
    console.error(c.blue(c.bold(ver) + '\n'))
  }

  return new Promise((resolve, reject) => {
    cli({
      disableBanner: true,
      inventory,
      logLevel,
      needsValidCreds: false,
      quiet,
      runtimeCheck: 'warn',
      symlink: args['disable-symlinks'],
    }, (err) => {
      if (err) return reject(err)
      if (quiet) {
        let isWin = process.platform.startsWith('win')
        let ready = isWin
          ? chars.done
          : c.green(c.dim('❤︎'))
        let readyMsg = c.white(`${ver} ready!`)
        console.error(`${ready} ${readyMsg}`)

        let { inv } = inventory
        let { _project: { preferences }, http, ws } = inv
        if (http || ws || inv.static) {
          // HTTP port selection logic lifted from Sandbox, this may require occasional maintenance
          let prefs = preferences?.sandbox?.ports
          let { ARC_HTTP_PORT, PORT } = process.env
          let n = idk => Number(idk)

          let port = args.port || args.p || 3333
          let specified = prefs?.http || n(port) || n(ARC_HTTP_PORT) || n(PORT)
          let link = c.green(c.bold(c.underline(`http://localhost:${specified}\n`)))
          process.stdout.write(link)
        }
      }
      resolve()
    })
  })
}

module.exports = {
  names,
  action,
  help,
}
