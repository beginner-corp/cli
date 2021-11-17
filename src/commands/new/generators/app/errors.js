let { backtickify, runtimes } = require('../../../../lib')

let errors = {
  en: {
    app_found: 'Existing Begin app already found in this directory',
    invalid_runtime: `Function runtime must be one of: ${backtickify(runtimes)}`,
  }
}

module.exports = function error (lang, err) {
  process.exitCode = 1
  return errors[lang][err]
}
