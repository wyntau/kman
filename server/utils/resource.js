var path = require('path')

    , Resource = require('koa-resource-router')
    , is = require('jistype')
    , _ = require('lodash')

    , resourcesDir = path.resolve(__dirname, '..', 'resources')

    ;

function createResource(args){
    function R(){
        return Resource.apply(this, args);
    }
    R.prototype = Resource.prototype;
    return new R();
}

module.exports = function(resourcePath){
    var resourceName
        , resourceDir

        , parentResourceName
        , parentResourceDir
        , parentResourcePath

        , resourceRelative
        , resourceChain

        , resource
        , parentResource

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
    }

    args = [].slice.call(arguments, 1);

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

    if(parentResourcePath){
        parentResource = require(parentResourcePath);
        parentResource.add(resource);
    }

    return resource;
};
