@app
mock

@static

@http
# login command
/devicecode
  method post
  src devicecode

/token
  method post
  src token

# logout command
/clients/:clientID/token/delete
  method post
  src token-delete

# upgrade command
/versions-upgrade
  method get
  src versions-upgrade

/versions-ok
  method get
  src versions-ok
