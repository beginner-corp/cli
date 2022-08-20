module.exports = function ({ name, package }) {
  return `import { ${name} } from "${package}"

export default ${name}
`
}
