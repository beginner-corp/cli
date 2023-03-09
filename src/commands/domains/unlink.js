async function action () {
  let c = require('picocolors')
  return [
    c.bold(c.red('This feature is not yet implemented')),
    c.gray('Please contact support@begin.com regarding domain subscriptions.'),
  ].join('\n')
}

module.exports = {
  name: 'unlink',
  description: 'Dissociate a domain from an app environment.',
  action,
  help: {
    en: {
      usage: [ 'domains unlink' ],
      description: 'Unlink from a domain',
      examples: [
        {
          name: 'unlink a domain',
          example: 'begin domains unlink --domain begin.com',
        },
      ]
    }
  }
}
