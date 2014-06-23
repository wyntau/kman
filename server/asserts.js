var path = require('path')
    , koa = require('koa')
    , serve = require('koa-static')
    , mount = require('koa-mount')

    , config = require('../config')

    , app = koa()
    ;

module.exports = app
    .use(mount('/images', serve(config.asserts.images)))
    .use(mount('/scripts', serve(config.asserts.scripts)))
    .use(mount('/bower_components', serve(config.asserts.bower_components)))
    .use(mount('/views', serve(config.asserts.views)))
    .use(mount('/styles', serve(config.asserts.styles)))
    ;