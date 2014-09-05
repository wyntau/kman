## KMAN
<strong>K</strong>oa + <strong>M</strong>ongoDB  + <strong>A</strong>ngular.js + <strong>N</strong>ode.js

A starting point for writing AngularJS apps backed by a Koa-powered node.js server.

KMAN based on [koan](https://github.com/soygul/koan), but have some differences with koan.

- use high level mongoose
- use high level socket.io (Experimental, not sure how to use it correctly)
- use SASS
- more pre-defined grunt tasks for development(watch, livereload) and deploy(compile, build, concat, uglify, compress, md5, etc.)

### Requirements
1. MongoDB
2. node >= 0.11.9
3. ruby and sass,compass gems
4. git

In addition, __Linux__ or __Mac__ is optional but recommended, because __Linux__ or __Mac__ is more friendly to ruby(& gems) and some npm packages.

### For Developers

1. Develop

        npm install -g bower grunt-cli
        npm install
        bower install
        grunt dev

    Then the default browser will open <http://localhost:3000> automatically.

    A livereload server was started by `grunt-contrib-watch` which will watch static files(css, sass, js, html) and server(via nodemon).

    So, if you want to refresh your browser when you changed specific files, maybe you should install the [browser extension](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-).
2. Test

    - Front-end e2e test. (Note: Before this test, the app server should be running, you can open another terminal, and run `node --harmony app.js`)

            grunt client_e2e

    - Front-end unit test

            grunt client_unit

    - Server test

        Upcoming
3. Build

        grunt build

    kman-v{VERSION}.zip will be in `zips` directory.

### For Deploy

    npm install --production
    npm start

You can see `nginx/kman.conf` for nginx setting for <http://kmanjs.com>

### LICENSE
MIT