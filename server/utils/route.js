var fs = require('fs')
    , path = require('path')

    , noop = require('koa-noop')
    , is = require('jistype')
    , noop = require('koa-noop')
    , except = require('except')
    , readDir = require('readdir')

    ;

module.exports = function(app, routeType){
    var dirPath
        , routeMethod
        , dirName
        ;

    // routeType => dirname, dirname is plural forms  of routeType
    dirName = routeType + 's';

    dirPath = path.resolve(__dirname, '..', dirName);

    if(routeType === 'resource'){
        routeMethod = routeResource;
    }else if(routeType === 'api' || routeType === 'path'){
        routeMethod = routePath;
    }else{
        throw new Error('routeType error: ' + routeType + '. select one from `resource`, `api` or `path`')
        process.exit(1);
    }

    return routeMethod(app, dirPath);
};


function routeResource(app, dirPath){
    if(fs.existsSync(dirPath)){

        readDir.readSync(dirPath, ['**.js']).forEach(function(file){
            var resource = require(path.join(dirPath, file));

            if(!resource.isPrivate){
                app.use(resource.middleware());
            }
        });
    }

    return noop;
};

function routePath(app, dirPath){
    if(fs.existsSync(dirPath)){
        readDir.readSync(dirPath, ['**.js']).forEach(function(file){
            var route = require(path.join(dirPath, file));

            if(!route.isPrivate){
                dispath(app, except(route, 'isPrivate'));
            }
        });
    }

    return noop;
}

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
                    process.exit(1);
                    break;
            }
        });
    });
};
