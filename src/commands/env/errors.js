module.exports = function error (params) {
  return function (err) {
    let { lang } = params
    let errors = {
      en: {
        app_not_found: 'No app found with that app ID',
        no_appid: 'App ID not found, please run with -a or --appID',
        no_env: 'Environment ID not found, please run with -e or --envID',
        no_name: 'Variable name not found, please run with -n or --name',
        no_value: 'Variable value not found, please run with -v or --value',
        create_fail: 'Failed to create environment variable',
        destroy_fail: 'Failed to destroy environment variable',
      }
    }
    return Error(errors[lang][err])
  }
}
