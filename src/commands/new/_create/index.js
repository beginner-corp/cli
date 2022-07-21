let api = require('./api')
let page = require('./page')
let events = require('./events')
let http = require('./http')
let scheduled = require('./scheduled')

module.exports = function create (params) {
  return {
    api:       api.bind({}, params),
    page:      page.bind({}, params),
    events:    events.bind({}, params),
    http:      http.bind({}, params),
    scheduled: scheduled.bind({}, params),
  }
}
