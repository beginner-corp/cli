module.exports = function error (params, utils) {
  return function (err) {
    let { lang } = params
    let { backtickify, runtimes } = utils
    let errors = {
      en: {
        project_found: 'Existing Begin app already found in this directory',
        invalid_runtime: `Function runtime must be one of: ${backtickify(runtimes)}`,
      }
    }
    return Error(errors[lang][err])
  }
}
