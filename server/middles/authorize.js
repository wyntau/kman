var jwt = require('koa-jwt')
    , config = require('../../config')
    , secret = config.secret
    , debug = config.env === 'development'
    ;

module.exports = jwt({
    secret: secret
    , debug: debug
});

module.exports.authorize = function(passthrough){
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