let action = require('./action')

module.exports = {
  name: 'http',
  description: 'Create a new HTTP route',
  action,
  help: () => {
    let { backtickify, httpMethods, runtimes } = require('../../../../lib')
    return {
      en: {
        contents: {
          header: 'HTTP parameters',
          items: [
            {
              name: '-m, --method',
              description: `HTTP method, one of: ${backtickify(httpMethods)}`,
            },
            {
              name: '-p, --path',
              description: 'URI path, must start with `/`, can include catchalls and URL params',
            },
            {
              name: '-s, --src',
              description: 'Custom path to handler source',
              optional: true,
            },
            {
              name: '-r, --runtime',
              description: `Runtime, one of: ${backtickify(runtimes)}`,
              optional: true,
            },
          ],
        },
        examples: [
          {
            name: 'Create a new HTTP route',
            example: 'begin new http --method get --path /',
          }
        ]
      },
    }
  }
}
