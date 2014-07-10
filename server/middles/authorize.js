var jwt = require('koa-jwt')

    , config = require('../../config')

    , secret = config.secret
    , debug = config.env === 'development'
    ;

function authorize(passthrough){
    return jwt({
        secret: secret
        , debug: debug
        , passthrough: passthrough || false
    });
}

module.exports = authorize();
module.exports.authorize = authorize;
module.exports.sign = function(obj, option){
    option = option || {};
    return jwt.sign(obj, secret, option);
};