let action = require('./action')

module.exports = {
  name: 'auth',
  description: 'Add authentication and example usage',
  action,
  help: () => {
    return {
      en: {
        // contents: {
        //   header: 'Add authentication and usage examples',
        //   items: [
        //     {
        //       name: '[model] [properties]',
        //       description: `New JSON Schema model name and properties`,
        //     },
        //     {
        //       name: '-f, --file',
        //       description: `New Path to a JSON Schema file`,
        //     }
        //   ],
        // },
        examples: [
          {
            name: 'Basic Usage',
            example: 'begin generate auth',
          }
        ]
      },
    }
  }
}
