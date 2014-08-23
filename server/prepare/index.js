var Promise = require('bluebird')
    , readDir = require('readdir')
    ;

module.exports = function(){
    var mods = [];

    readDir.readSync(__dirname, ['*.js', '*/'], readDir.ABSOLUTE_PATHS).forEach(function(modPath){
        if(modPath == __filename){
            return;
        }
        modPath = modPath.replace(/\/$/, '');
        mods.push(require(modPath));
    });

    return Promise.all(mods);
};
