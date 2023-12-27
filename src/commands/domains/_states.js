// ! These states come from the API, so they should be kept in sync

const states = {
  PURCHASING: 'PURCHASING',   // customer received purchase link
  REGISTERING: 'REGISTERING', // purchased, waiting on Route53 registration
  UNVALIDATED: 'UNVALIDATED', // added, but not yet validated
  VALIDATING: 'VALIDATING',   // waiting on DNS validation
  ACTIVE: 'ACTIVE',           // domain has been set up and is available for linking
  LINKING: 'LINKING',         // setting up certs and DNS
  LINKED: 'LINKED',           // domain linked with customer environment
  UNLINKING: 'UNLINKING',     // removing DNS entries, becomes ACTIVE
  UNKNOWN: 'UNKNOWN',         // unknown state, failed to link
  LAPSED: 'LAPSED',           // customer had a failed payment
  CANCELLED: 'CANCELLED',     // customer has cancelled subscription
  DELETED: 'DELETED',         // NOT USED! customer has deleted domain
}

module.exports.canLink = [
  states.ACTIVE,
  states.UNKNOWN,
]

module.exports.cantDelete = [
  states.LINKED,
  states.LINKING,
]

module.exports = states
