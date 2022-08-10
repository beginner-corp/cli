module.exports = function ({ plural, capPlural, singular, capSingular }) {
  return `import data from '@begin/data'
import { validator } from '@begin/validator'
import { ${capSingular} } from '../schemas/${singular}.mjs'

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

const validate = {
    async create (req) {
        let problems = []
        if (req.body.key) {
            problems.push({ error: 'Create should not include an key parameter'})
        }
        let res = validator(req, ${capSingular})
        if (!res.valid) {
            res.errors.map(e => problems.push(e.stack))
        }
        // Insert your custom validation here
        return problems.length > 0 ? { problems, ${singular}: req.body } : false
    },
    async update (req) {
        let problems = []
        let res = validator(req, ${capSingular})
        if (!res.valid) {
            res.errors.map(e => problems.push(e.stack))
        }
        // Insert your custom validation here
        return problems.length > 0 ? { problems, ${singular}: req.body } : false
    }
}

export {
    delete${capSingular},
    get${capSingular},
    get${capPlural},
    upsert${capSingular},
    validate
}
`
}
