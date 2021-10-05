module.exports = {
  name: 'http',
  description: 'Create a new HTTP route',
  action: async function () {
    // TODO: build me!
    return { stdout: 'Hi from the @http generator' }
  },
  help: {
    contents: {
      header: 'HTTP parameters',
      items: [
        {
          name: '-m, --method',
          description: 'HTTP method, one of: `any`, `get`, `post`, `put`, `patch`, `delete`',
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
