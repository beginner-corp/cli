module.exports = function error (params) {
  return function (err) {
    let { lang } = params
    let errors = {
      en: {
        no_appid_found: 'No app found with that app ID',
        no_appid: 'App ID not found, please run with -a or --appID',
        no_env: 'Env ID not found, please run with -e or --envID',
        no_key: 'Key not found, please run with -k or --key',
        no_value: 'Value not found, please run with -v or --value',
      }
    }
    return Error(err.map(error => errors[lang][error]).join('\n'))
  }
}
