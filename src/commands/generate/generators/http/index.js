let action = require('./action')

module.exports = {
  name: 'http',
  description: 'Create a new HTTP route',
  action,
  help: () => {
    let { backtickify, httpMethods } = require('../../../../lib')
    return {
      en: {
        contents: {
          header: 'HTTP parameters',
          items: [
            {
              name: '-p, --path',
              description: 'URI path, must start with `/`, can include catchalls and URL params',
            },
            {
              name: '-m, --method',
              description: `HTTP method, one of: ${backtickify(httpMethods)}`,
              optional: true,
            },
            {
              name: '-s, --src',
              description: 'Custom path to handler source',
              optional: true,
            },
          ],
        },
        examples: [
          {
            name: 'Create a new HTTP route',
            example: 'begin gen http --method get --path /',
          }
        ]
      },
    }
  }
}
