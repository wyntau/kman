var koa = require('koa')
    , json = require('koa-json')
    , jsonp = require('koa-jsonp')
    , bodyParser = require('koa-bodyparser')
    , validator = require('koa-validator')

    , routeResource = require('./utils/routeResource')

    , app = koa()
    ;

module.exports = app
    .use(json({pretty: false, param: 'pretty'}))
    .use(jsonp())
    .use(bodyParser())
    .use(validator())
    .use(routeResource(app))
    ;