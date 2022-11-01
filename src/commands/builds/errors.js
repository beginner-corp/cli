module.exports = function error (params) {
  return function (err) {
    let { lang } = params
    let errors = {
      en: {
        app_not_found: 'No app found with that app ID',
        no_env: 'Environment ID not found, please run with -e or --env',
        invalid_env: 'Invalid or incorrect environment ID',
      }
    }
    return Error(errors[lang][err])
  }
}
