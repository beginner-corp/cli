async function action () {
  let c = require('@colors/colors/safe')
  // TODO: create link for Stripe customer dashbaord
  return [
    c.bold(c.red('This feature is not yet implemented')),
    c.gray('Please contact support@begin.com regarding domain subscriptions.'),
  ].join('\n')
}

module.exports = {
  name: 'remove',
  description: 'Cancel a Begin.com domain subscription',
  action,
}
