module.exports = function ({ plural, capPlural, singular, capSingular }) {
  const id = singular + '-${nanoid()}'

  return `import arc from '@architect/functions'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890bcdfghjklmnpqrstvwz', 8) // locase no vowels

const delete${capSingular} = async function (id) {
    const db = await arc.tables()

    let result = await db.${plural}.delete({
        ID: id
    })

    return result
}

const upsert${capSingular} = async function (${singular}) {
    const db = await arc.tables()

    if (!${singular}.ID) {
        ${singular}.ID = \`${id}\`
    }

    let result = await db.${plural}.put(${singular})

    return result
}

const get${capSingular} = async function (id) {
    const db = await arc.tables()

    let ${singular} = await db.${plural}.get({ ID: id })

    return ${singular}
}

const get${capPlural} = async function () {
    const db = await arc.tables()

    let ${plural} = await db.${plural}.scan()

    return ${plural}.Items
}

export {
    delete${capSingular},
    get${capSingular},
    get${capPlural},
    upsert${capSingular}
}
`
}
