module.exports = function error (params) {
  return function (err) {
    let { lang } = params
    let errors = {
      en: {
        schema_already_exists: 'The schema already exists',
      }
    }
    return Error(errors[lang][err])
  }
}
