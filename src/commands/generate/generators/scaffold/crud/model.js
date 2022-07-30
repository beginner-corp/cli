module.exports = function ({ plural, capPlural, singular, capSingular }) {
  return `import data from '@begin/data'

const delete${capSingular} = async function (key) {
    return data.destroy({ table: '${plural}', key })
}

const upsert${capSingular} = async function (${singular}) {
    return data.set({ table: '${plural}', ...${singular} })
}

const get${capSingular} = async function (key) {
    return data.get({ table: '${plural}', key })
}

const get${capPlural} = async function () {
    return data.get({ table: '${plural}' })
}

export {
    delete${capSingular},
    get${capSingular},
    get${capPlural},
    upsert${capSingular}
}
`
}
