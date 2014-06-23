var jwt = require('koa-jwt')
    , config = require('../../config')
    , secret = config.secret
    , debug = config.env === 'development'
    ;

module.exports = function(passthrough){
    return jwt({
        secret: secret
        , debug: debug
        , passthrough: passthrough || false
    });
};

module.exports.sign = function(obj, option){
    option = option || {};
    return jwt.sign(obj, secret, option);
};