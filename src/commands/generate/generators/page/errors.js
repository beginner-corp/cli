
module.exports = function error ({ lang }) {
  return function (err) {
    let errors = {
      en: {
        no_path: 'Page path not found, please run with -p or --path',
        invalid_path: `Invalid page path`,
        invalid_type: `Invalid page type, must be one of: html or javascript`,
        page_exists: 'Page already exists'
      }
    }
    return Error(errors[lang][err])
  }
}
