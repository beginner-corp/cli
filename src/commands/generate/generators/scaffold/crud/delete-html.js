module.exports = function ({ plural, capSingular }) {
  return `import arc from '@architect/functions'
import { delete${capSingular} } from '@architect/shared/db/${plural}.mjs'

export default async function HTML(req) {
    const id = req.pathParameters?.id

    await delete${capSingular}(id)

    return {
        location: '/${plural}'
    }
}
`
}
