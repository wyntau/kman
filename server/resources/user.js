var Resource = require('koa-resource-router')
    , Promise = require('bluebird')

    , User = require('../models/user')
    ;

module.exports = new Resource('users', {
    index: function *(next){}
    , show: function *(next){}
    , create: function *(next){
        var user = new User(this.request.body);

        yield Promise.promisify(user.save, user)();

        this.status = 201;
        this.body = user;
    }
});