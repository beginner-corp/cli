let names = { en: [ 'update', 'upgrade' ] }
let help = require('./help')

async function action () {
  return 'Use npm to update the Begin CLI to the latest version.'
}

module.exports = {
  names,
  action,
  help,
}
