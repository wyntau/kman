var Promise = require('bluebird')

    , User = require('../models/user')

    , resource = require('../utils/resource')
    ;

module.exports = resource(__filename, {
    index: function *(next){}
    , show: function *(next){}
    , create: function *(next){
        var user = new User(this.request.body);

        yield Promise.promisify(user.save, user)();

        this.status = 201;
        this.body = user;
    }
});