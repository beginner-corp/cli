module.exports = {
  names: { en: [ 'version', 'ver', 'v' ] },
  action: ({ appVersion }) => {
    return {
      string: `Begin ${appVersion}`,
      json: {
        begin: process.argv[0],
        version: appVersion,
      }
    }
  }
}
