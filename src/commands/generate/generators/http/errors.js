module.exports = function error (params, utils) {
  return function (err) {
    let { lang } = params
    let { backtickify, httpMethods, runtimes } = utils
    let errors = {
      en: {
        no_method: 'HTTP method not found, please run with -m or --method',
        invalid_method: `Invalid HTTP method, must be one of: ${backtickify(httpMethods)}`,
        no_path: 'HTTP path not found, please run with -p or --path',
        invalid_path: 'HTTP path must be a string',
        path_starts_with_slash: 'HTTP path must begin with `/`',
        invalid_runtime: `Function runtime must be one of: ${backtickify(runtimes)}`,
        src_must_be_in_project: 'Function source path must be within your project',
      }
    }
    return Error(errors[lang][err])
  }
}
