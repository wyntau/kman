var Resource = require('koa-resource-router')
    , userResource = require('./user')
    , User = require('../models/user')
    , mongoose = require('mongoose')
    , config = require('../../config')
    , ObjectId = mongoose.Types.ObjectId
    ;

var Picture = new Resource('picture', {
    index: function *(next){
        var userId = this.params.user
            , user
            , img
            ;

        userId = userId; //new ObjectId(userId);

        user = yield User.findOne({
            _id: userId
        }, {
            picture: 1
        }).exec();

        if(!user){
            console.log('nouser');
            return;
        }

        img = new Buffer(user.picture, 'base64');
        this.set('Content-Type', 'image/jpeg');
        if(config.app.cacheTime){
            this.set('Cache-Control', 'max-age=' + (config.app.cacheTime / 1000));
        }
        this.body = img;
    }
});

userResource.add(Picture);

module.exports = Picture;
