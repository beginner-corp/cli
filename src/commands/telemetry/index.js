module.exports = {
  names: { en: [ 'telemetry' ] },
  action: (params) => {
    let { appVersion, args, cliDir } = params
    let { disable, enable } = args

    let lib = require('../../lib')
    let { getConfig } = lib
    let writeFile = lib.writeFile(params)

    let { join } = require('path')
    let { existsSync } = require('fs')
    let c = require('picocolors')
    let now = new Date().toISOString()
    let on = c.white(c.bold('enabled'))
    let off = c.white(c.bold('disabled'))

    let configFile = join(cliDir, 'config.json')
    let config = getConfig(params)
    function maybeCreateConfigFile () {
      if (!existsSync(configFile)) {
        config = {
          '// Begin config': `you can edit this file, just be sure to keep your 'access_token' secret (if you have one)`,
          created: now,
          createdVer: appVersion,
          modified: now,
        }
        writeFile(configFile, JSON.stringify(config, null, 2))
      }
    }

    let message
    if (enable) {
      maybeCreateConfigFile()
      config.collectBasicTelemetry = true
      config.modified = now
      writeFile(configFile, JSON.stringify(config, null, 2))
      message = `Basic CLI telemetry manually set to ${on}`
    }
    else if (disable) {
      maybeCreateConfigFile()
      config.collectBasicTelemetry = false
      config.modified = now
      writeFile(configFile, JSON.stringify(config, null, 2))
      message = `Basic CLI telemetry manually set to ${off}`
    }
    else {
      let setting = config.collectBasicTelemetry === false ? off : on
      message = `Basic CLI telemetry is ${setting}`
    }
    return {
      string: message,
      json: { message }
    }
  },
  help: {
    en: {
      usage: [ 'telemetry [parameters]', '[options]' ],
      description: `Enable, disable, or check the CLI's basic telemetry collection setting\n  Note: CLI argument values and detailed information are never collected`,
      contents: {
        header: 'Manually enable / disable',
        items: [
          {
            name: '--enable',
            description: `Enable CLI telemetry`,
            optional: true,
          },
          {
            name: '--disable',
            description: `Disable CLI telemetry`,
            optional: true,
          },
        ],
      },
      examples: [
        {
          name: 'Check the current CLI telemetry setting',
          example: 'begin telemetry',
        },
        {
          name: 'Enable CLI telemetry',
          example: 'begin telemetry --enable',
        },
        {
          name: 'Disable CLI telemetry',
          example: 'begin telemetry --disable',
        },
      ]
    }
  }
}
