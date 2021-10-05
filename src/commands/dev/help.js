module.exports = {
  usage: [ 'dev', '[options]' ],
  description: 'Start the Begin local development server',
  contents: {
    header: 'Dev server options',
    items: [
      {
        name: '-p, --port',
        description: `Configure the dev server's HTTP port`,
      },
      {
        name: '-v, --verbose',
        description: 'Enable verbose output',
      },
      {
        name: '--disable-symlinks',
        description: '[Advanced] Disable shared code symlinking',
      },
    ],
  },
  examples: [
    {
      name: 'Start the Begin dev server',
      example: 'begin dev',
    },
    {
      name: 'Start the dev server on port 6666',
      example: 'begin dev --port 6666',
    },
  ],
}
