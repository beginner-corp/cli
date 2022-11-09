let cwd = process.cwd()

module.exports = async function action (params, utils) {
  let { args } = params
  let { create, validate } = utils
  let { resolve } = require('path')
  let inventory = require('@architect/inventory')
  let error = require('./errors')(params)

  let invalid = await validate.project()
  if (invalid) return invalid

  // Name (required)
  let name = args.name || args.n
  if (!name || name === true) {
    return error('no_name')
  }
  if (name && typeof name !== 'string') {
    return error('invalid_name')
  }

  // Must have one of rate or cron but not both
  let rate = args.rate || args.r
  let cron = args.cron || args.c
  if (!cron && !rate) {
    return error('must_specify_rate_or_cron')
  }
  if (cron && rate) {
    return error('must_specify_one_of_rate_or_cron')
  }

  // Validate cron or rate
  let raw = `@app\nvalidate-scheduled\n@scheduled\n${name} `
  if (cron) {
    let rawArc = raw + `cron(${cron})`
    try {
      await inventory({ rawArc })
    }
    catch (err) {
      // TODO pass along the actual error from Inventory
      return error('invalid_cron_expression')
    }
  }
  else if (rate) {
    let rawArc = raw + `rate(${rate})`
    try {
      await inventory({ rawArc })
    }
    catch (err) {
      // TODO pass along the actual error from Inventory
      return error('invalid_rate_expression')
    }
  }

  // Source dir (optional)
  let src = args.src || args.s
  if (src && !resolve(src).startsWith(cwd)) {
    return error('src_must_be_in_project')
  }

  return create.scheduled({ name, rate, cron, src })
}
