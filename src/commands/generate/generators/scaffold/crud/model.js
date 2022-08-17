module.exports = function ({ plural, capPlural, singular, capSingular }) {
  return `import data from '@begin/data'
import { convertToNestedObject, validator } from '@begin/validator'
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
        let problems = {}
        let { res, data } = validator(req, ${capSingular})
        if (!res.valid) {
            res.errors.forEach(e => {
                let key = e.property === 'instance' ? e.argument : e.property.replace(/instance./,'')
                let msg = e.message.replace(/"/g,'')
                if (problems[key]) {
                    problems[key].errors = \`\${problems[key].errors}<p>\${msg}</p>\`
                } else {
                    problems[key] = { errors: \`<p>\${msg}</p>\` }
                }
            })
        }
        return { problems: convertToNestedObject(problems), data }
    },
    async create (req) {
        let { problems, data } = validate.shared(req)
        if (req.body.key) {
            problems['key'] = { errors: '<p>should not be included on a create</p>' }
        }
        // Insert your custom validation here
        return Object.keys(problems).length > 0 ? { problems, ${singular}: data } : { ${singular}: data }
    },
    async update (req) {
        let { problems, data } = validate.shared(req)
        // Insert your custom validation here
        return Object.keys(problems).length > 0 ? { problems, ${singular}: data } : { ${singular}: data }
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
