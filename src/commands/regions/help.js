module.exports = async function (params) {
  const {
    args: { _: commands },
  } = params
  const action = commands[1]

  if (HELP[action]) return HELP[action]

  return {
    en: {
      usage: [ 'regions <action> <parameters>', '[options]' ],
      description: 'Begin regions',
      contents: {
        header: 'Regions actions',
        items: [
          { name: 'list', description: 'List Begin regions' },
        ],
      },
    },
  }
}

const HELP = {
  list: {
    en: {
      usage: [ 'regions list', '[options]' ],
      description: 'List Begin regions',
      contents: {
        header: 'List Begin regions',
        example: 'begin regions list',
      },
    },
  },
}
