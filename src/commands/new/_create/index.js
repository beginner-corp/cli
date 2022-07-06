let events = require('./events')
let http = require('./http')
let scheduled = require('./scheduled')

module.exports = function create (params) {
  return {
    events:    events.bind({}, params),
    http:      http.bind({}, params),
    scheduled: scheduled.bind({}, params),
  }
}
