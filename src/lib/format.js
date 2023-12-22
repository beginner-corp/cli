module.exports = function () {
  const c = require('@colors/colors/safe')

  const name = c.bold

  const formatter = {
    name,
    ID: (id) => `<${id}>`,
    date: (date) => new Date(date).toLocaleString(),
    app: {
      name: name.green,
    },
    env: {
      name,
      location: c.dim,
    },
    domain: {
      managed: c.underline.green,
      external: c.underline.cyan,
    },
    c,
  }

  formatter.e = formatter.env
  formatter.a = formatter.app
  formatter.d = formatter.domain

  return formatter
}
