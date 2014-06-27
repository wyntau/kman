var User = require('../models/user')
    , sign = require('../middles/authorize').sign
    , only = require('only')
    , request = require('co-request')
    , gravatar = require('gravatar').url
    , Promise = require('bluebird')
    , passport = require('../pre/passport')

    ;

module.exports = {
    'POST /signin': function *(next){
        var body = this.request.body
            , user
            ;

        user = yield User.findOne({
            email: body.email
            , password: body.password
        }, {
            _id: 1
            , name: 1
            , avatar: 1
        }).exec();

        if(!user){
            this.throw(401, 'Incorrect e-mail address or password.');
        }else{

            var token = sign(user, {
                expireInMinutes: 90 * 24 * 60
            });

            this.body = {
                token: token
                , user: user
            };
        }
    }
    , 'GET /signin/facebook': passport.authenticate('facebook')
    , 'GET /signin/facebook/callback': [function *(next){
        var ctx = this;
        yield passport.authenticate('facebook', {
            failureRedirect: '/signin.html'
        }, function *(err, user, info){
            ctx.user = user;
            yield next;
        }).call(this);
    }, function *(next){
        var profile = this.user;
        var user = yield User.findOne({
            platform: 'facebook'
            , platformId: profile.id
        }, {
            _id: 1
            , name: 1
            , avatar: 1
        }).exec();

        if(!user){
            user = new User({
                email: profile.emails[0].value
                , platformId: profile.id
                , platform: 'facebook'
                , name: profile.displayName
                , avatar: gravatar(profile.emails[0].value)
            });
        }else{
            user.name = profile.displayName;
            user.email = profile.emails[0].value;
        }

        yield Promise.promisify(user.save, user)();

        var showUser = only(user, [
            '_id'
            , 'name'
            , 'avatar'
        ]);

        var token = sign(showUser, {
                expireInMinutes: 90 * 24 * 60
            });

        this.redirect('/?user=' + encodeURIComponent(JSON.stringify({token: token, user: showUser})));
    }]
    , 'GET /signin/google': passport.authenticate('google', {scope: 'profile'})
    , 'GET /signin/google/callback': [function *(next){
        var ctx = this;
        yield passport.authenticate('google', {
            failureRedirect: '/signin.html'
        }, function *(err, user, info){
            ctx.user = user;
            yield next;
        }).call(ctx);
    }, function *(next){
        var profile = this.user;
        var user = yield User.findOne({
            platform: 'google'
            , platformId: profile.id
        }, {
            _id: 1
            , name: 1
            , avatar: 1
        }).exec();

        if(!user){
            user = new User({
                platform: 'google'
                , platformId: profile.id
                , name: profile.displayName
                , avatar: profile._json.picture
            });
        }else{
            user.name = profile.displayName;
            user.avatar = profile._json.picture;
        }
        yield Promise.promisify(user.save, user)();

        var showUser = only(user, [
            '_id'
            , 'name'
            , 'avatar'
        ]);

        var token = sign(showUser, {
                expireInMinutes: 90 * 24 * 60
            });

        this.redirect('/?user=' + encodeURIComponent(JSON.stringify({token: token, user: showUser})));
    }]
    , 'GET /signin/weibo': passport.authenticate('weibo')
    , 'GET /signin/weibo/callback': [function *(next){
        var ctx = this;
        yield passport.authenticate('weibo', {
            failureRedirect: '/signin.html'
        }, function *(user){
            ctx.user = user;
            yield next;
        }).call(ctx);
    }, function *(next){
        var profile = this.user;
        var user = yield User.findOne({
            platform: 'weibo'
            , platformId: profile.idstr
        }, {
            _id: 1
            , name: 1
            , avatar: 1
        }).exec();

        if(!user){
            user = new User({
                platform: 'weibo'
                , platformId: profile.idstr
                , name: profile.screen_name
                , avatar: profile.avatar_large
            });
        }else{
            user.name = profile.screen_name;
            user.avatar = profile.avatar_large;
        }
        yield Promise.promisify(user.save, user)();

        var showUser = only(user, [
            '_id'
            , 'name'
            , 'avatar'
        ]);

        var token = sign(showUser, {
                expireInMinutes: 90 * 24 * 60
            });

        this.redirect('/?user=' + encodeURIComponent(JSON.stringify({token: token, user: showUser})));
    }]
};
