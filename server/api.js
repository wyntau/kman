var koa = require('koa')
    , json = require('koa-json')
    , jsonp = require('koa-jsonp')
    , backend = require('koa-backend')
    , bodyParser = require('koa-bodyparser')
    , validator = require('koa-validator')

    , app = koa()
    ;

module.exports = app
    .use(json({pretty: false, param: 'pretty'}))
    .use(jsonp())
    .use(bodyParser())
    .use(validator())
    .use(backend(app, __dirname + '/apis'))
    ;
