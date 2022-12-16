let capitalize = s => s && s[0].toUpperCase() + s.slice(1)

function getType (key, property) {
  if (key === 'key') {
    return 'hidden'
  }
  let { type } = property
  if (type === 'boolean') {
    return 'checkbox'
  }
  else if (type === 'string') {
    if (property.format) {
      if (property.format === 'date-time') {
        return 'datetime-local'
      }
      else if (property.format === 'uri') {
        return 'url'
      }
      else {
        return property.format
      }
    }
    return 'text'
  }
  return type
}

function inputTemplate (key, type, property, data, required = [], keyPrefix = '') {
  let tagName = type === 'checkbox' ? 'checkbox' : 'text-input'
  if (type === 'hidden') {
    return `<input type="hidden" id="${key}" name="${key}" value="\${${data}?.${key}}" />`
  }

  // if the json schema indicates an number allow decimals
  if (type === 'number' && !property.step) {
    property.step = 0.01
  }
  // otherwise, just and integer
  else if (type === 'integer') {
    type = 'number'
  }

  let name = keyPrefix ? `${keyPrefix}` : key
  let dataPath = keyPrefix ? keyPrefix.replace(/\./g, '?.') : key

  let input = `<${tagName} label="${capitalize(key).replace(/([a-z])([A-Z])/g, '$1 $2')}" type="` + type + '" id="' + name + '" name="' + name + '" '
  if (property.minimum) {
    input = input + 'min="' + property.minimum + '" '
  }
  if (property.minLength) {
    input = input + 'minlength="' + property.minLength + '" '
  }
  if (property.maximum) {
    input = input + 'max="' + property.maximum + '" '
  }
  if (property.maxLength) {
    input = input + 'maxlength="' + property.maxLength + '" '
  }
  if (property.pattern) {
    input = input + 'pattern="' + property.pattern + '" '
  }
  if (property.description) {
    input = input + 'description="' + property.description + '" '
  }
  if (property.step) {
    input = input + 'step="' + property.step + '" '
  }
  if (required.includes(key)) {
    input = input + 'required '
  }
  if (type === 'checkbox' && data[key] === true) {
    input = input + 'checked '
  }
  input = input + `value="\${${data}?.${dataPath}}" errors="\${problems?.${dataPath}?.errors}"></${tagName}>`
  return input
}

function selectTemplate (key, property, data, required = [], keyPrefix = '') {
  let name = keyPrefix ? `${keyPrefix}.${key}` : key
  let dataPath = keyPrefix ? keyPrefix.replace(/\./g, '?.') : key
  let input = `<label for="${name}" class="radius0">
  <div class="mb-3">
    ${capitalize(name)}
  </div>
  <select id="${name}" name="${name}" class="p-2 flex-grow w-full font-light text0 radius0 border-solid mb-2 border1 select-none" `
  if (required.includes(key)) {
    input = input + 'required'
  }
  input = input + '>'
  property.enum.forEach(item => input = input + `<option value="${item}" \${"${item}" === ${data}?.${dataPath} ? 'selected' : ''}>${item}</option>`)
  input = input + '</select></label>'
  return input
}

function input (key, schema, data, prefix = '') {
  let property = schema.properties[key]
  let type = getType(key, property)
  let elem = ''
  if (property.enum) {
    elem = selectTemplate(key, property, data, schema.required, prefix)
  }
  else if (type === 'object') {
    elem = elem + `<field-set legend="${capitalize(key)}">`
    elem = elem + Object.keys(schema.properties[key].properties).map(innerKey =>
      input(innerKey, schema.properties[key], data, key)
    ).join('\n')
    elem = elem + `</field-set>`
  }
  else if (type === 'array') {
    // TODO: skip arrays for now
  }
  else {
    let keyPrefix = prefix ? `${prefix}.${key}` : ''
    elem = inputTemplate(key, type, property, data, schema.required, keyPrefix)
  }
  return elem
}

function schemaToForm ({ action, schema, update = false, data }) {
  return `<form-element
  action="/${action}${update ? `/\${${data}.key}` : ''}"
  method="POST">
  <div class="\${problems.form ? 'block' : 'hidden'}">
    <p>Found some problems!</p>
    <ul>\${problems.form}</ul>
  </div>
  <field-set legend="${capitalize(schema?.id)}">
  ${Object.keys(schema.properties).map(key =>
    input(key, schema, data)
  ).join('\n  ')}
  <submit-button style="float: right"><span slot="label">Save</span></submit-button>
  </field-set>
</form-element>`
}

module.exports = {
  schemaToForm
}
