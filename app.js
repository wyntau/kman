var http = require('http')
    , koa = require('koa')
    , favi = require('koa-favi')
    , logger = require('koa-logger')
    , mount = require('koa-mount')
    , serve = require('koa-static')
    , minifier = require('koa-html-minifier')
    , co = require('co')

    , mongoose = require('mongoose')

    , mongoseed = require('./server/pre/mongoseed')

    , assertsApp = require('./server/asserts')
    , renderApp = require('./server/render')
    , apiApp = require('./server/api')

    // , socket = require('./server/socket')

    , config = require('./config')

    , app = koa()

    , server

    ;

exports.init = co(function *(){
    mongoose.connect(config.mongo.url);
    yield mongoseed();

    app
        .use(favi())
        .use(logger())
        .use(minifier({
            collapseWhitespace: config.minifier.collapseWhitespace,
            removeComments: config.minifier.removeComments
        }))
        .use(mount(config.app.apiPrefix, apiApp))
        .use(mount(assertsApp))
        .use(mount(renderApp))
        .listen(config.app.port)
        ;

    console.log('app is listening port', config.app.port);
});

if(!module.parent){
    exports.init();
}

// server = http.Server(app.callback());

// socket(server);

// server.listen(config.app.port)

