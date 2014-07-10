var koa = require('koa')
    , router = require('koa-router')
    , bodyParser = require('koa-bodyparser')
    , validator = require('koa-validator')
    , views = require('koa-views')

    , route = require('./utils/route')
    , passport = require('./pre/passport')

    , app = koa()
    ;

module.exports = app
    .use(bodyParser())
    .use(validator())
    .use(views('./views', {
        default: 'swig'
        , cache: 'memory'
    }))
    .use(passport.initialize())
    .use(router(app))
    .use(route(app, 'path'))
    ;
