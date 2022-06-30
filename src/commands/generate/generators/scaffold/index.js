let action = require('./action')

module.exports = {
  name: 'scaffold',
  description: 'Create MVC code for CRUD apps',
  action,
  help: () => {
    return {
      en: {
        contents: {
          header: 'JSON Schema parameters',
          items: [
            {
              name: '[model] [properties]',
              description: `JSON Schema model name and properties`,
            },
            {
              name: '-f, --file',
              description: `Path to a JSON Schema file`,
            }
          ],
        },
        examples: [
          {
            name: 'Scaffold a CRUD app',
            example: 'begin generate scaffold Books title:string author:string publication_year:integer',
          },
          {
            name: 'Scaffold a CRUD app from JSON Schema file',
            example: 'begin generate scaffold --file person.schema.json',
          }
        ]
      },
    }
  }
}
