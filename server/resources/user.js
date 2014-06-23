var Resource = require('koa-resource-router')
    , User = require('../models/user')
    ;

module.exports = new Resource('users', {
    index: function *(next){}
    , show: function *(next){}
    , create: function *(next){
        var user = new User(this.request.body);

        yield user.save().exec();

        this.status = 201;
        this.body = user;
    }
});