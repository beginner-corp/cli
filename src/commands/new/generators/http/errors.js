let { backtickify, httpMethods, runtimes } = require('../../../../lib')

let errors = {
  en: {
    no_method: 'HTTP method not found, please run with -m or --method',
    invalid_method: `Invalid HTTP method, must be one of: ${backtickify(httpMethods)}`,
    no_path: 'HTTP path is required',
    invalid_path: 'HTTP path must be a string',
    path_starts_with_slash: 'HTTP path must begin with `/`',
    invalid_runtime: `Function runtime must be one of: ${backtickify(runtimes)}`,
    src_must_be_in_project: 'Function source path must be within your project',
  }
}

module.exports = function error (lang, err) {
  process.exitCode = 1
  return errors[lang][err]
}
