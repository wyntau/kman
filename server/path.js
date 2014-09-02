var koa = require('koa')
    , backend = require('koa-backend')
    , bodyParser = require('koa-bodyparser')
    , validator = require('koa-validator')
    , views = require('koa-views')
    , passport = require('koa-passport')

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
    .use(backend(app, __dirname + '/paths'))
    ;
