let errors = {
  en: {
    no_project: 'No project found in this directory, please run: `begin new app`',
    only_app_dot_arc: 'Only app.arc files are supported',
  }
}

module.exports = function error (lang, err) {
  let message = errors[lang][err]
  return Error(message)
}
