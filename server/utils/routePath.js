var fs = require('fs')
    , path = require('path')
    , noop = require('koa-noop')
    , dispath = require('./dispath')
    , except = require('except')

    , pathsPath = path.resolve(__dirname, '../paths')
    ;

module.exports = function(app){
    fs.readdirSync(pathsPath).forEach(function(file){

        var route = require(path.join(pathsPath, file));

        if(!route.isPrivate){
            dispath(except(route, 'isPrivate'))(app);
        }
    });
    return noop;
};