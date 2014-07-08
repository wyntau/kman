var Resource = require('koa-resource-router')
    , User = require('../models/user')
    , Promise = requirer('bluebird')
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