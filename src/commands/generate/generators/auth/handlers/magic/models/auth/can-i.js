module.exports = function () {
  return `export default function (req, operation) {
  const { session = {} } = req
  const account = session.account
  const userPermissions = account?.permissions?.filter(Boolean)
  let rules = userPermissions?.map(i => i.rules).map((role) => {
    let newRules = []
    for (const property in role) {
      const index = Number.parseInt(property.replace(/([^_]*)_(\\d*)/gm, '$2')) - 1
      const newProperty = property.replace(/([^_]*)_(\\d*)/gm, '$1')
      newRules[index] = newRules[index] || {}
      newRules[index][newProperty] = role[property]
    }
    return newRules
  }).flat()

  const match = rules?.filter(rule => {
    return ((operation.action === rule.action)
      && (operation.target === rule.target)
      && (operation.owner === rule.owner)
      && ((operation?.id === rule?.id) || (!operation?.id && !rule?.id)))
  })
  return match?.length > 0

}


`
}
