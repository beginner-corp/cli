const visibleTypes = [ 'TXT', 'MX', 'ALIAS', 'SPF' ]

async function action (params) {
  let c = require('@colors/colors/safe')
  let client = require('@begin/api')
  let { config, args, domain, verbose } = params
  let { access_token: token, stagingAPI: _staging } = config
  let { add, remove, type, name, value, ttl } = args
  add = add || args.a
  remove = remove || args.r
  type = type || args.t
  name = name || args.n
  // value = value || args.v // -v is "verbose"

  if (!domain)
    return Error('Please specify a domain with --domain')

  if (add || remove) {
    if (!type || (typeof type === 'string' && type.length === 0))
      type = 'TXT' // defaults to TXT
    if (!name || (typeof name === 'string' && name.length === 0))
      return Error('Please specify a record name with --name')
    if (!value || (typeof value === 'string' && value.length === 0))
      return Error('Please specify record value with --value')

    ttl = Number(ttl) || 300
    value = `"${value}"`
  }

  // @ts-ignore
  let domains = await client.domains.list({ token, _staging })
  let theDomain = domains.find(d => d.domain === domain)

  if (!theDomain)
    return Error([
      `You do not subscribe to the domain "${domain}".`,
      `To subscribe, run: begin domains check ${domain}`,
    ].join('\n'))

  if (add) {
    let result = await client.domains.records.upsert({
      token,
      // @ts-ignore
      _staging,
      domainID: theDomain.domainID,
      changes: [ { type, name, value, ttl } ],
    })

    return `Added record ${c.bold(type)} ${c.cyan(name)} (${result.status})`
  }
  else if (remove) {
    let result = await client.domains.records.delete({
      token,
      // @ts-ignore
      _staging,
      domainID: theDomain.domainID,
      record: { type, name, value, ttl },
    })

    return `Removed record ${c.bold(type)} ${c.cyan(name)} (${result.status})`
  }
  else { // list records
    let records = await client.domains.records.list({ token, _staging, domainID: theDomain.domainID })
    let outputRecords = verbose ? records : records.filter(r => visibleTypes.includes(r.type))
    outputRecords = outputRecords.sort((a, b) => a.type.localeCompare(b.type))

    if (outputRecords.length === 0) {
      return c.red(`No records found for ${c.underline(c.cyan(domain))}`)
    }
    else {
      let { tableStyle } = require('../../lib')
      let Table = require('cli-table3')
      let table = new Table({
        head: [ 'Type', 'Name', 'TTL', 'Value' ],
        ...tableStyle,
      })
      for (const r of outputRecords)
        table.push([ c.bold(r.type), c.cyan(r.name), r.ttl, r.values?.join('\n') ])

      return `\n${table.toString()}`
    }
  }
}

module.exports = {
  name: 'records',
  description: 'Manage DNS records for a domain',
  action,
}
