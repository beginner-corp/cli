module.exports = function error (params) {
  return function (err) {
    let { lang } = params
    let errors = {
      en: {
        no_name: 'Scheduled name not found, please run with -n or --name',
        invalid_name: `Invalid scheduled name`,
        must_specify_rate_or_cron: `Neither a rate or cron expression was specified. Please run with --rate or --cron`,
        must_specify_one_of_rate_or_cron: `Only one interval is supported per schedule. Please run with --rate or --cron, not both`,
        invalid_cron_expression: `The specified cron expression is invalid`,
        invalid_rate_expression:  `The specified rate expression is invalid`,
        src_must_be_in_project: 'Function source path must be within your project',
      }
    }
    let error = typeof err === 'string' ? err : err.map(e => errors[lang][e]).join('\n')
    return Error(error)
  }
}
