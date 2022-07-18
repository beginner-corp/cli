module.exports = function error (params) {
  return function (err) {
    let { lang } = params
    let errors = {
      en: {
        no_appid_found: 'No app found with that app ID',
        no_env: 'Env ID not found, please run with -e or --envID',
        invalid_env: 'Incorrect env ID',
      }
    }
    return Error(err.map(error => errors[lang][error]).join('\n'))
  }
}
