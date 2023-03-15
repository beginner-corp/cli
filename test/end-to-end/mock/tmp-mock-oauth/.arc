@app
begin-app

@plugins
enhance/arc-plugin-enhance
oauth

@oauth
use-mock true

mock-list models/auth/mock-allow.mjs

allow-list models/auth/allow.mjs
