module.exports = function error (params) {
  return function (err) {
    let { lang } = params
    let errors = {
      en: {
        oauth_plugin_already_installed: 'The OAuth plugin is already installed',
      }
    }
    return Error(errors[lang][err])
  }
}
