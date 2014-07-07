var http = require('http')
    , koa = require('koa')
    , favi = require('koa-favi')
    , logger = require('koa-logger')
    , mount = require('koa-mount')
    , minifier = require('koa-html-minifier')
    , mongoose = require('mongoose')

    , pkg = require('./package.json')

    , mongoseed = require('./server/pre/mongoseed')
    , assertsApp = require('./server/asserts')
    , renderApp = require('./server/render')
    , apiApp = require('./server/api')
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
        .use(mount('/api', apiApp))
        .use(mount(assertsApp))
        .use(mount(renderApp))
        ;

    // create http server instance for socket.io
    server = http.Server(app.callback());
    // init socket.io and start server
    socket
    .init(server)
    .listen(config.app.port);

    console.log('%s is listening port %d', pkg.name, config.app.port);
});
