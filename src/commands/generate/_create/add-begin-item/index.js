function nameHandlerFile ({ path, prefix, runtime }) {
  let { join } = require('path')
  let cwd = process.cwd()
  let ext = runtime === 'html' ? '.html' : '.mjs'
  return join(cwd, prefix, `${path}${ext}`)
}

module.exports = async function create ({ path, prefix, handler, lang, runtime }, params) {
  let { existsSync } = require('fs')
  let { prompt } = require('enquirer')
  let errors = require('./errors')
  let mutateArc = require('../../../../lib/mutate-arc')
  let lib = require('../../../../lib')
  let { promptOptions } = lib
  let writeFile = lib.writeFile(params)
  let _inventory = require('@architect/inventory')
  let inventory = await _inventory()

  if (!inventory.get.plugins('enhance/arc-plugin-enhance')) {
    // ask if you want it added
    console.log('enhance/arc-plugin-enhance is required for this feature.')
    let { installIt } = await prompt({
      type: 'confirm',
      name: 'installIt',
      message: `Would you like to add enhance/arc-plugin-enhance to your app?`,
      initial: 'y',
    }, promptOptions)

    if (installIt) {
      let project = inventory.inv._project
      let raw = project.raw
      raw = mutateArc.upsert({ item: 'enhance/arc-plugin-enhance', pragma: 'plugins', raw })
      await writeFile(project.manifest, raw)

      // TODO: should we npm install it as well?
    }
    else {
      return
    }
  }

  let handlerFile = nameHandlerFile({ prefix, path, runtime })

  if (existsSync(handlerFile)) {
    return errors(lang, 'found_file', handlerFile)
  }
  else {
    await writeFile(handlerFile, handler)
  }
}
