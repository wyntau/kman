var http = require('http')
    , koa = require('koa')
    , favi = require('koa-favi')
    , logger = require('koa-logger')
    , mount = require('koa-mount')
    , minifier = require('koa-html-minifier')
    , mongoose = require('mongoose')

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

        console.log('=========================================================');
        console.log('      ___           ___           ___           ___');
        console.log('     /\\__\\         /\\__\\         /\\  \\         /\\__\\');
        console.log('    /:/  /        /::|  |       /::\\  \\       /::|  |');
        console.log('   /:/__/        /:|:|  |      /:/\\:\\  \\     /:|:|  |');
        console.log('  /::\\__\\____   /:/|:|__|__   /::\\~\\:\\  \\   /:/|:|  |__');
        console.log(' /:/\\:::::\\__\\ /:/ |::::\\__\\ /:/\\:\\ \\:\\__\\ /:/ |:| /\\__\\');
        console.log(' \\/_|:|~~|~    \\/__/~~/:/  / \\/__\\:\\/:/  / \\/__|:|/:/  /');
        console.log('    |:|  |           /:/  /       \\::/  /      |:/:/  /');
        console.log('    |:|  |          /:/  /        /:/  /       |::/  /');
        console.log('    |:|  |         /:/  /        /:/  /        /:/  /');
        console.log('     \\|__|         \\/__/         \\/__/         \\/__/');
        console.log('=========================================================');
        console.log('kman is listening port', config.app.port);
    });
};

if(!module.parent){
    exports.init();
}

