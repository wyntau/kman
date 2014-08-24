var path = require('path')

    , Promise = require('bluebird')
    , readDir = require('readdir')

    , preparesPath = path.resolve(__dirname, 'prepares')
    ;

module.exports = function(){
    var mods = [];

    readDir.readSync(preparesPath, ['*.js', '*/'], readDir.ABSOLUTE_PATHS).forEach(function(modPath){
        modPath = modPath.replace(/\/$/, '');
        mods.push(require(modPath));
    });

    return Promise.all(mods);
};
