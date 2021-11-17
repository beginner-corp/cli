let errors = {
  en: {
    no_project: 'No project found!',
    only_app_dot_arc: 'Only app.arc files are supported',
  }
}

module.exports = function error (lang, err) {
  process.exitCode = 1
  return errors[lang][err]
}
