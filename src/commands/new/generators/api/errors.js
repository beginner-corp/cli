
module.exports = function error ({ lang }) {
  return function (err) {
    let errors = {
      en: {
        no_path: 'API path not found, please run with -p or --path',
        invalid_path: `Invalid API path`,
        api_exists: 'API already exists',
      }
    }
    return Error(errors[lang][err])
  }
}
