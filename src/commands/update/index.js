let names = { en: [ 'update', 'upgrade' ] }

async function action (params) {
  let { printer } = params
  let { execSync } = require('child_process')
  let isWin = process.platform.startsWith('win')
  // TODO: use appVersion / flags to determine channel
  let cmd = isWin
    ? 'iwr https://dl.begin.com/install.ps1 -useb | iex'
    : 'curl -sS https://dl.begin.com/install.sh | sh -s main'
  try {
    let result = execSync(cmd)
    // TODO: add better status / logging
    printer.verbose(params, result.toString())
    console.error('Successfully upgraded!') // TODO: print version
  }
  catch (err) {
    printer.debug(err)
    return Error('Update failed, please try again')
  }
}

module.exports = {
  names,
  action,
}
