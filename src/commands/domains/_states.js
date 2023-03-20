// ! These states come from the API, so they should be kept in sync

module.exports = {
  PURCHASING: 'PURCHASING',   // customer received purchase link
  REGISTERING: 'REGISTERING', // purchased, waiting on Route53 registration
  ACTIVE: 'ACTIVE',           // domain has been set up and is available for linking
  LINKING: 'LINKING',         // setting up certs and DNS
  LINKED: 'LINKED',           // domain linked with customer environment
  UNLINKING: 'UNLINKING',     // removing DNS entries, becomes ACTIVE
  LAPSED: 'LAPSED',           // customer had a failed payment
  CANCELLED: 'CANCELLED',     // customer has cancelled subscription
  DELETED: 'DELETED',
}
