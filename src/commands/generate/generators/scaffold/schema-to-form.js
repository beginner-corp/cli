const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

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

function inputTemplate (key, type, property, data, required = []) {
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

  let input = `<enhance-text-input label="${capitalize(key).replace(/([a-z])([A-Z])/g, '$1 $2')}" type="` + type + '" id="' + key + '" name="' + key + '" '
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
  input = input + `value="\${${data}?.${key}}" errors="\${problems?.${key}?.errors}"></enhance-text-input>`
  return input
}

function selectTemplate (key, property, data, required = []) {
  let input = '<select id="' + key + '" name="' + key + '"'
  if (required.includes(key)) {
    input = input + 'required'
  }
  input = input + '>'
  property.enum.forEach(item => input = input + `<option value="${item}" ${item === data[key]?.value ? 'selected' : ''}>${item}</option>`)
  input = input + '</select>'
  return input
}

function input (key, schema, data) {
  const property = schema.properties[key]
  const type = getType(key, property)
  let elem = ''
  if (property.enum) {
    elem = selectTemplate(key, property, data, schema.required)
  }
  else if (type === 'object') {
    elem = elem + `<h2>${capitalize(key)}</h2>`
    elem = elem + Object.keys(schema.properties[key].properties).map(innerKey =>
      input(innerKey, schema.properties[key], data)
    ).join('\n')
  }
  else {
    elem = inputTemplate(key, type, property, data, schema.required)
  }
  return elem
}

function schemaToForm ({ action, schema, update = false, data }) {
  return `<h1 class="mb1 font-semibold text3">${capitalize(schema?.id)}</h1>
<form
  style="display: flex; flex-direction: column; gap: 1rem;"
  action="/${action}${update ? `/\${${data}.key}` : ''}"
  method="POST">
  ${Object.keys(schema.properties).map(key =>
    input(key, schema, data)
  ).join('\n  ')}
  <button style="max-width: 6rem;">Save</button>
</form>`
}

module.exports = {
  schemaToForm
}
