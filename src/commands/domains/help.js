/**
 * @typedef {Object} HelpContents
 * @property {string} header
 * @property {{name: string, description: string}[]} items
 */
/**
 * @typedef {Object} HelpExample
 * @property {string} name
 * @property {string} example
 */
/**
 * @typedef {Object} Help
 * @property {string[]} usage
 * @property {string} [description]
 * @property {HelpContents} [contents]
 * @property {HelpExample[]} [examples]
 */

/** @returns {Promise<{[lang: string]: Help}>} */
module.exports = async function (params) {
  const {
    args: { _: commands },
  } = params
  const action = commands[1]

  if (HELP[action]) return HELP[action]

  return {
    en: {
      usage: [ 'domains <action> <parameters>', '[options]' ],
      description: 'Interact with your Begin domain names',
      contents: {
        header: 'Domains actions',
        items: [
          { name: 'list', description: 'List your Begin account domain names' },
          { name: 'add', description: 'Check domain availability' },
          { name: 'link', description: 'Link a domain to an app' },
          { name: 'unlink', description: 'Unlink a domain from an app' },
          { name: 'remove', description: 'Unsubscribe from a domain' },
        ],
      },
    },
    es: {
      usage: [ 'domains <acción> <parámetros>', '[opciones]' ],
      description: 'Interactuar con los nombres de dominio de Begin',
      contents: {
        header: 'Acciones de dominios',
        items: [
          { name: 'list', description: 'Listar los nombres de dominio de su cuenta Begin' },
          { name: 'add', description: 'Comprobar la disponibilidad de un dominio' },
          { name: 'link', description: 'Vincular un dominio a una aplicación' },
          { name: 'unlink', description: 'Desvincular un dominio de una aplicación' },
          { name: 'remove', description: 'Cancelar la suscripción de un dominio' },
        ],
      },
    },
  }
}

/** @type {{[action: string]: {[lang: string]: Help}}} */
const HELP = {
  add: {
    en: {
      usage: [ 'domains add <parameters>', '[options]' ],
      description: 'Check domain availability and get a link to subscribe',
      contents: {
        header: 'Add parameters',
        items: [
          { name: '--domain', description: 'Domain name to check' },
        ],
      },
      examples: [
        {
          name: 'Check begin.com availability',
          example: 'begin domains add --domain begin.com',
        },
      ],
    },
  },
  link: {
    en: {
      usage: [ 'domains link <parameters>', '[options]' ],
      description: 'Link a domain to an app + env',
      contents: {
        header: 'Link parameters',
        items: [
          { name: '-a, --app', description: 'App ID, if not in Begin project working dir' },
          { name: '--domain', description: 'Domain name to link' },
          { name: '-e, --env', description: 'Environment name or ID to link to' },
        ],
      },
      examples: [
        {
          name: 'Link begin.com to an app',
          example:
            'begin domains link --domain begin.com --env <name|ID> --app [ID]',
        },
      ],
    },
  },
  list: {
    en: {
      usage: [ 'domains list <parameters>', '[options]' ],
      description: 'List your Begin account domain names',
      examples: [
        {
          name: 'List all domains',
          example: 'begin domains list',
        },
      ],
    },
  },
  remove: {
    en: {
      usage: [ 'domains remove <parameters>', '[options]' ],
      description: 'Unsubscribe from a domain',
      contents: {
        header: 'Remove parameters',
        items: [
          { name: '--domain', description: 'Domain name to remove' },
        ],
      },
      examples: [
        {
          name: 'Remove a domain',
          example: 'begin domains remove --domain begin.com',
        },
      ],
    },
  },
  unlink: {
    en: {
      usage: [ 'domains unlink <parameters>', '[options]' ],
      description: 'Unlink a domain from an app + env',
      contents: {
        header: 'Unlink parameters',
        items: [
          { name: '--domain', description: 'Domain name to unlink' },
        ],
      },
      examples: [
        {
          name: 'unlink a domain',
          example: 'begin domains unlink --domain begin.com',
        },
      ],
    },
  },
}
