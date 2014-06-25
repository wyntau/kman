## KMAN
<strong>K</strong>oa + <strong>M</strong>ongoDB  + <strong>A</strong>ngular.js + <strong>N</strong>ode.js

A starting point for writing AngularJS apps backed by a Koa-powered node.js server.

### Requirements
1. MongoDB
2. node >= 0.11.9

### For Develop

    npm install
    bower install

    export NODE_ENV=development
    node --harmony app.js

    open http://localhost:3000

### For Deploy

    npm install --production
    export NODE_ENV=production
    node --harmony app.js

### LICENSE
MIT