var koa = require('koa')
    , router = require('koa-router')
    , bodyParser = require('koa-bodyparser')
    , spa = require('koa-spa')

    , config = require('../config')
    , routePath = require('./utils/routePath')

    , app = koa()
    ;

module.exports = app
    .use(bodyParser())
    .use(router(app))
    .use(routePath(app))
    .use(spa(config.app.client, {
        index: config.app.indexFile
        , static: {
            gzip: true
        }
    }))
    ;