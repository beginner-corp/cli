module.exports = function ({ plural, capSingular  }) {
  return `// View documentation at: https://docs.begin.com
  import { delete${capSingular} } from '../../../db/${plural}.mjs'

  export async function post (req) {
    const id = req.pathParameters?.id
    await delete${capSingular}(id)
    return {
      location: '/${plural}'
    }
  }
    `
}
