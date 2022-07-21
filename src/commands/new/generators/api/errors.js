
module.exports = function error ({ lang }) {
  return function (err) {
    let errors = {
      en: {
        no_path: 'API path not found, please run with -p or --path',
        invalid_path: `Invalid API path`,
      }
    }
    return Error(errors[lang][err])
  }
}
