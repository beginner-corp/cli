let { mkdirSync } = require('fs')


module.exports = async function action (params, utils) {
  let { mutateArc, writeFile, npmCommands } = utils
  let { installDependencies } = npmCommands
  let project = params.inventory.inv._project
  let raw = project.raw


  // 1. Add allow list files to Models/auth directory
  const mockAllow = `
export default {
  mockProviderAccounts: {
    'Jane Doe': {
      login: 'janedoe',
      name: 'Jane Doe'
    },
    'John Smith': {
      login: 'johnsmith',
      name: 'John Smith'
    },
    // A simulated OAuth user not authorized for the app
    'Not Authorized': {
      login: 'notallowed',
      name: 'Not Allowed'
    }
  },
  appAccounts: {
    janedoe: {
      role: 'member',
      name: 'Jane Doe'
    },
    johnsmith: {
      role: 'member',
      name: 'John Smith'
    }
  }
}`
  const allow = `
// For production allow list add users below where keys match unique property of OAuth user
export default {
  appAccounts: {
     // janedoe: {
     //   role: 'member',
     //   name: 'Jane Doe'
     // }
   }
}`
  mkdirSync(`models/auth`, { recursive: true })
  writeFile(`models/auth/mock-allow.mjs`, mockAllow)
  writeFile(`models/auth/allow.mjs`, allow)

  // 2. Install Plugin
  installDependencies([ `arc-plugin-oauth` ])

  // 3. Add plugin pragma and oauth pragma to arc file
  raw = mutateArc.upsert({ pragma: 'plugins', item: 'arc-plugin-oauth',  raw })
  raw = mutateArc.upsert({ pragma: 'oauth', item: 'use-mock true', raw })
  raw = mutateArc.upsert({ pragma: 'oauth', item: 'mock-list auth/mock-allow.mjs',  raw })
  raw = mutateArc.upsert({ pragma: 'oauth', item: 'allow-list auth/allow.mjs', raw })
  // Write the arcfile to disk
  writeFile(project.manifest, raw)

  // 4. Add examples
  const jsonExampleApi = `
import arcOauth from 'arc-plugin-oauth'
const checkAuth = arcOauth.checkAuth
export async function get(req) {
  const authenticated = checkAuth(req)
  if (authenticated) {
    return {
      json: { data: ['fred', 'joe', 'mary'] }
    }
  } else {
    return {
      statusCode:401,
      json:{error:"not authorized"}
    }
  }
}
`

  const htmlExamplePage = `export default function({html,state}) {
  const user = state?.store?.account
  return html\`<p> Hello \${ user?.name }</p>\`
}`
  const htmlExampleApi = `import arcOauth from 'arc-plugin-oauth'
const checkAuth = arcOauth.checkAuth
export async function get(req) {
  const authenticated = checkAuth(req)
  if (authenticated) {
    return {
      json: { account: authenticated }
    }
  } else {
    return {
      session:{redirectAfterAuth:"/auth/html-example"},
      location: "/login" 
    }
  }
}`
  mkdirSync(`app/pages/auth`, { recursive: true })
  writeFile(`app/pages/auth/html-example.mjs`, htmlExamplePage)

  mkdirSync(`app/api/auth`, { recursive: true })
  writeFile(`app/api/auth/html-example.mjs`, htmlExampleApi)
  writeFile(`app/api/auth/json-example.mjs`, jsonExampleApi)

  // add example custom authorizer

  const customAuthorizer = /* javascript*/`
  /* Custom Authorizer Route
  If user accounts from allow.mjs list are not enough 
  add the custom authorizer.
  1. Add custom auth route in .arc manifest
    @oauth
    custom-authorizer /custom-auth
  2. Add an app/api/custom-auth.mjs route

  The plugin calls this route with an oauth object on the session. Check this against allowed users (i.e. in database). Add an account key to the session and redirect to location: process.env.ARC_OAUTH_AFTER_AUTH. 
  */

  

export async function get(req) {
  const providerAccount = req?.session?.oauth
  const session = req?.session
  let { redirectAfterAuth='', ...newSession={} } = session

  if (providerAccount) {
    const matchOn = process.env.ARC_OAUTH_MATCH_PROPERTY
    
    // read from database i.e. vvv
    //  import begin from '@begin/data'
    //  const data = await begin()
    //  const appUser = await data.get({table:'users',key:providerAccount.user[matchOn]})
    const userFakeDatabase = {
      janedoe: {
        role: 'member',
        name: 'Jane Doe'
      }
    }
    const appUser = userFakeDatabase?.[providerAccount.user[matchOn]]
    // ^^^ Database code here

    if (appUser) {
      newSession = {...newSession,account:appUser}
      return {
        session:newSession,
        location: redirectAfterAuth || process.env.ARC_OAUTH_AFTER_AUTH
      }
    } 
    else {
      return {
        statusCode: 401,
        body: 'not authorized'
      }
    }
  }
  else {
    return {
      statusCode: 302,
      location: process.env.ARC_OAUTH_UN_AUTH_REDIRECT
    }
  }
}
  `

  // TODO: Custom Authorize, Decide if we should write this out
  // writeFile(`app/api/auth/custom-authorize.mjs`, customAuthorizer)
}
