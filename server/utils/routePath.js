var fs = require('fs')
    , is = require('jistype')
    , path = require('path')
    , noop = require('koa-noop')
    , except = require('except')

    , pathsPath = path.resolve(__dirname, '../paths')
    ;

module.exports = function(app){
    if(fs.existsSync(pathsPath)){
        fs.readdirSync(pathsPath).forEach(function(file){
            if(/^\./.test(file)){
                return;
            }
            var route = require(path.join(pathsPath, file));

            if(!route.isPrivate){
                dispath(app, except(route, 'isPrivate'));
            }
        });
    }

    return noop;
};

function dispath(app, routes) {
    // 将路由表的每一项附加到app上
    Object.keys(routes).forEach(function(key) {
        var args = routes[key]
            , methodPath = key.split(' ')
            , methodStr = methodPath[0].toUpperCase()
            , path = methodPath[1]
            , methods = methodStr.split(',')
            ;

        if (is.isArray(args)) {
            args.unshift(path);
        } else {
            args = [path, args];
        }

        methods.forEach(function(method){
            switch (method) {
                case 'GET':
                    app.get.apply(app, args);
                    break;
                case 'POST':
                    app.post.apply(app, args);
                    break;
                case 'PUT':
                    app.put.apply(app, args);
                    break;
                case 'DELETE':
                    app.delete.apply(app, args);
                    break;
                case 'ALL':
                    app.get.apply(app, args);
                    app.post.apply(app, args);
                    app.put.apply(app, args);
                    app.delete.apply(app, args);
                    break;
                default:
                    throw new Error('Invalid HTTP method specified for route ' + path);
                    break;
            }
        });
    });
};