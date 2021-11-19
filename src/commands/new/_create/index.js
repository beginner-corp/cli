let events = require('./events')
let http = require('./http')

module.exports = function create (params) {
  return {
    events: events.bind({}, params),
    http:   http.bind({}, params),
  }
}
