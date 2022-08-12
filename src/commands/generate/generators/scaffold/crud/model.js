module.exports = function ({ plural, capPlural, singular, capSingular }) {
  return `import data from '@begin/data'
import { validator } from '@begin/validator'
import { ${capSingular} } from '../app/schemas/${singular}.mjs'

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
    shared (req) {
        let res = validator(req, ${capSingular})
        if (!res.valid) {
            return res.errors.map(e => {
                return { name: e.property.replace(/instance\./,''), error: e.message }
            })
        }
        return []
    },
    async create (req) {
        let problems = [...validate.shared(req)]
        if (req.body.key) {
            problems.push({ name: 'key', error: 'should not be included on a create'})
        }
        // Insert your custom validation here
        return problems.length > 0 ? { problems, book: req.body } : false
    },
    async update (req) {
        let problems = [...validate.shared(req)]
        // Insert your custom validation here
        return problems.length > 0 ? { problems, book: req.body } : false
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
