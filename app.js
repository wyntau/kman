var http = require('http')

    , koa = require('koa')
    , favi = require('koa-favi')
    , logger = require('koa-logger')
    , mount = require('koa-mount')
    , minifier = require('koa-html-minifier')
    , mongoose = require('mongoose')

    , pkg = require('./package.json')
    , mongoseed = require('./server/pre/mongoseed')
    , assertsApp = require('./server/assert')
    , pathsApp = require('./server/path')
    , resourcesApp = require('./server/resource')
    , apisApp = require('./server/api')
    , socket = require('./server/socket')
    , config = require('./config')

    , app = koa()
    , server

    ;

// connect to mongoDB
mongoose.connect(config.mongo.url);
// prepare mongoseed
mongoseed()
.then(function(){
    // prepare koa middlewares
    app
        .use(favi())
        .use(logger())
        .use(minifier({
            collapseWhitespace: config.minifier.collapseWhitespace,
            removeComments: config.minifier.removeComments
        }))
        // Here we add one more apisApp, separate from resourcesApp.
        // So we can have more power for backend service, not only RESTful API.
        // Thus, we have two service prefixs, `/api` for normal style API when
        // the API can't be abstracted to one resource, `/resource` for resource
        // style API.
        // All other paths will be treated as pages and asserts paths.
        // Just like below
        .use(mount('/resource', resourcesApp))
        .use(mount('/api', apisApp))
        .use(mount(pathsApp))
        .use(mount(assertsApp))
        ;

    // create http server instance for socket.io
    server = http.Server(app.callback());
    // init socket.io
    socket.init(server);
    // start server
    server.listen(config.app.port);

    console.log('%s is listening port %d', pkg.name, config.app.port);
});
