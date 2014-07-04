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

exports.init = function(){
    mongoose.connect(config.mongo.url);
    mongoseed()
    .then(function(){
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

        server = http.Server(app.callback());
        socket
        .init(server)
        .listen(config.app.port);

        console.log('%s is listening port %d', pkg.name, config.app.port);
    });
};

if(!module.parent){
    exports.init();
}

