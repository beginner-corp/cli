let errors = {
  en: {
    found_file: str => `File already exists: ${str}`,
  }
}

module.exports = function error (lang, err, meta) {
  let message = meta ? errors[lang][err](meta) : errors[lang][err]
  return Error(message)
}
