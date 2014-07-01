var fs = require('fs')
    , path = require('path')
    , noop = require('koa-noop')

    , resourcesPath = path.resolve(__dirname, '../resources')
    ;

module.exports = function(app){
    if(fs.existsSync(resourcesPath)){
        fs.readdirSync(resourcesPath).forEach(function(file){

            var resource = require(path.join(resourcesPath, file));

            if(!resource.isPrivate){
                app.use(resource.middleware());
            }
        });
    }

    return noop;
};