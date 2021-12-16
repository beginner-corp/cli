module.exports = {
  names: { en: [ 'version', 'ver', 'v' ] },
  action: ({ appVersion }) => {
    let message = `Begin ${appVersion}`
    return {
      string: message,
      json: {
        begin: process.argv[0],
        version: appVersion,
        message,
      }
    }
  }
}
