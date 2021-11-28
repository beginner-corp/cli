module.exports = {
  en: {
    usage: [ 'update', '[options]' ],
    description: 'Update Begin to the latest version',
    contents: {
      header: 'Update options',
      items: [
        {
          name: '--use',
          description: 'Switch between `latest` (stable) and `main` (canary) channels',
          optional: true,
        },
      ],
    }
  }
}
