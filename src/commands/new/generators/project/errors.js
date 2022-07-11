module.exports = function error (params, utils) {
  return function (err) {
    let { lang } = params
    let { backtickify, runtimes } = utils
    let errors = {
      en: {
        no_path: 'Project name not found, please run with -n or --name',
        folder_creation: 'Unable to create project folder',
        project_found: 'Existing Begin app already found in this directory',
        invalid_appname: `Invalid app name`,
        invalid_runtime: `Function runtime must be one of: ${backtickify(runtimes)}`,
      }
    }
    return Error(errors[lang][err])
  }
}
