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

# upgrade command
/versions-upgrade
  method get
  src versions-upgrade

/versions-ok
  method get
  src versions-ok
