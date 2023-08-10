const visibleTypes = [ 'TXT', 'MX', 'ALIAS', 'SPF' ]

async function action (params) {
  const c = require('@colors/colors/safe')
  const client = require('@begin/api')
  const { args, domain, verbose } = params
  const { access_token: token, stagingAPI: _staging } = params.config
  let { add, remove, type, name, value, values, ttl } = args
  add = add || args.a
  remove = remove || args.r
  type = type || args.t
  name = name || args.n
  // value = value || args.v // -v is "verbose"

  if (values) values = values.split(', ')

  if (!domain) return Error('Please specify a domain with --domain')

  const domains = await client.domains.list({ _staging, token })
  const theDomain = domains.find((d) => d.domain === domain)

  if (!theDomain)
    return Error(
      [
        `You do not subscribe to the domain "${domain}".`,
        `To subscribe, run: begin domains check ${domain}`,
      ].join('\n'),
    )

  if (add || remove) {
    const { Input, List, Select, Toggle } = require('enquirer')
    if (!type || (typeof type === 'string' && type.length === 0)) {
      // type = 'TXT' // defaults to TXT
      const prompt = new Select({
        name: 'type',
        message: 'Select a record type',
        choices: [ 'TXT', 'MX', 'ALIAS', 'SPF' ],
      })
      type = await prompt.run()
    }
    if (!name || (typeof name === 'string' && name.length === 0)) {
      // return Error('Please specify a record name with --name')
      const prompt = new Input({
        name: 'name',
        message: 'Enter a record name',
        initial: `${theDomain.domain}.`,
      })
      name = await prompt.run()
    }
    if (
      (!value || (typeof value === 'string' && value.length === 0)) &&
      (!values || values.length === 0)
    ) {
      // return Error('Please specify record value with --value')
      const multiValuePrompt = new Toggle({
        message: 'Add multiple values?',
        enabled: 'Yes',
        disabled: 'No',
      })
      const multiValue = await multiValuePrompt.run()
      if (multiValue) {
        const prompt = new List({
          name: 'value',
          message: 'Enter comma-separated values',
        })
        values = await prompt.run()
      }
      else {
        const prompt = new Input({
          name: 'value',
          message: 'Enter a record value',
        })
        value = await prompt.run()

        if (type === 'TXT') value = `"${value}"`
      }
    }

    if (!ttl || (typeof ttl === 'string' && ttl.length === 0)) {
      const prompt = new Input({
        name: 'ttl',
        message: 'Enter a TTL value',
        initial: '300',
      })
      ttl = await prompt.run()
    }

    ttl = Number(ttl) || 300
  }

  if (add) {
    const result = await client.domains.records.upsert({
      _staging,
      token,
      domainID: theDomain.domainID,
      changes: [ { type, name, value, ttl } ],
    })

    return `Added record ${c.bold(type)} ${c.cyan(name)} (${result.status})`
  }
  else if (remove) {
    const result = await client.domains.records.delete({
      _staging,
      token,
      domainID: theDomain.domainID,
      record: { type, name, value, ttl },
    })

    return `Removed record ${c.bold(type)} ${c.cyan(name)} (${result.status})`
  }
  else {
    // list records
    const records = await client.domains.records.list({
      _staging,
      token,
      domainID: theDomain.domainID,
    })
    let outputRecords = verbose
      ? records
      : records.filter((r) => visibleTypes.includes(r.type))
    outputRecords = outputRecords.sort((a, b) => a.type.localeCompare(b.type))

    if (outputRecords.length === 0) {
      return c.red(`No records found for ${c.underline(c.cyan(domain))}`)
    }
    else {
      const { tableStyle } = require('../../lib')
      const Table = require('cli-table3')
      const table = new Table({
        head: [ 'Type', 'Name', 'TTL', 'Value' ],
        ...tableStyle,
      })
      for (const r of outputRecords)
        table.push([
          c.bold(r.type),
          c.cyan(r.name),
          r.ttl,
          r.values?.join('\n'),
        ])

      return `\n${table.toString()}`
    }
  }
}

module.exports = {
  name: 'records',
  description: 'Manage DNS records for a domain',
  action,
}
