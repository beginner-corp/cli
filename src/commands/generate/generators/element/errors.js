
module.exports = function error (params) {
  return function (err) {
    let { lang } = params
    let errors = {
      en: {
        no_name: 'Element name not found, please run with -n or --name',
        invalid_name: `The supplied element name is invalid and can\'t be used.\nSee: https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name`,
      }
    }
    return Error(errors[lang][err])
  }
}
