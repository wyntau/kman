var path = require('path')
    , koa = require('koa')
    , router = require('koa-router')
    , bodyParser = require('koa-bodyparser')
    , spa = require('koa-spa')
    , views = require('koa-views')

    , config = require('../config')
    , routePath = require('./utils/routePath')

    , passport = require('./pre/passport')

    , app = koa()
    ;

module.exports = app
    .use(bodyParser())
    .use(views('./views', {
        default: 'swig'
    }))
    .use(passport.initialize())
    .use(router(app))
    .use(routePath(app))
    .use(spa(path.join(config.root, 'client'), {
        index: 'index.html'
        , static: {
            gzip: true
        }
    }))
    ;