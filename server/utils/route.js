var fs = require('fs')
    , path = require('path')

    , Resource = require('koa-resource-router')
    , _ = require('lodash')
    , noop = require('koa-noop')
    , is = require('jistype')
    , noop = require('koa-noop')
    , except = require('except')
    , readDir = require('readdir')

    , resourcesDir = path.resolve(__dirname, '..', 'resources')

    , resourceDict = {}

    ;

module.exports = function(app, routeType){
    var dirPath
        , dispatchMethod
        , dirName
        ;

    // routeType => dirname, dirname is plural forms  of routeType
    dirName = routeType + 's';

    dirPath = path.resolve(__dirname, '..', dirName);

    if(routeType === 'resource'){
        dispatchMethod = dispatchResource;
    }else if(routeType === 'api' || routeType === 'path'){
        dispatchMethod = dispatchPath;
    }else{
        throw new Error('routeType error: ' + routeType + '. select one from `resource`, `api` or `path`')
        process.exit(1);
    }

    return dispatchMethod(app, dirPath);
};


function dispatchResource(app, dirPath){
    if(fs.existsSync(dirPath)){

        readDir.readSync(dirPath, ['**.js'], readDir.ABSOLUTE_PATHS).forEach(function(file){
            var resource = getResource(file);
            if(!resource.isPrivate){
                app.use(resource.middleware());
            }
        });
    }

    return noop;
};

function getResource(resourcePath){
    // we have created the resource
    if(resourceDict.hasOwnProperty(resourcePath)){
        return resourceDict[resourcePath];
    }

    var resourceName
        , resourceDir
        , resource

        , parentResourceName
        , parentResourceDir
        , parentResourcePath
        , parentResource

        , resourceRelative
        , resourceChain

        , isPrivate
        , args
        , obj

        ;

    resourceName = path.basename(resourcePath, '.js');
    resourceDir = path.dirname(resourcePath);

    resourceRelative = path.relative(resourcesDir, resourceDir);

    if(resourceRelative){

        resourceChain = resourceRelative.split(path.sep);
        parentResourceName = resourceChain.pop();
        parentResourceDir = path.join(resourcesDir, resourceChain.join(path.sep));
        parentResourcePath = path.join(parentResourceDir, parentResourceName + '.js');

        parentResource = getResource(parentResourcePath);
    }

    args = require(resourcePath);

    if(is.isObject(args)){
        args = [args];
    }

    if(is.isString(args[args.length - 1])){
        // define option name
        resourceName = args.pop();
    }

    // the last one is our defined object.
    obj = args[args.length - 1];

    if(obj.isPrivate){
        isPrivate = true;
        delete obj.isPrivate;
    }

    resource = createResource(_.flatten([resourceName, args]));

    if(isPrivate){
        resource.isPrivate = true;
    }

    if(parentResource){
        parentResource.add(resource);
    }

    resourceDict[resourcePath] = resource;

    return resource;
}

function createResource(args){
    function R(){
        return Resource.apply(this, args);
    }
    R.prototype = Resource.prototype;
    return new R();
}

function dispatchPath(app, dirPath){
    if(fs.existsSync(dirPath)){
        readDir.readSync(dirPath, ['*.js', '*/'], readDir.INCLUDE_DIRECTORIES + readDir.ABSOLUTE_PATHS).forEach(function(file){
            // remove all dir trailing slash
            file = file.replace(/\/$/, '');
            var route = require(file);

            if(!route.isPrivate){
                dispatchRoute(app, except(route, 'isPrivate'));
            }
        });
    }

    return noop;
}

function dispatchRoute(app, routes) {
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
