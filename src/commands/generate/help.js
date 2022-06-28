module.exports = {
  en: {
    usage: [ 'generate', '[options]' ],
    description: 'Generates scaffolding code',
    contents: {
      header: 'Generate options',
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
