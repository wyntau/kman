var config = require('../../config')
    , User = require('../models/user')
    , sign = require('../middles/authorize').sign
    , only = require('only')
    , request = require('co-request')
    , qs = require('querystring')
    , co = require('co')
    , gravatar = require('gravatar').url
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
    , 'GET /signin/facebook': function *(next){
        this.redirect(
          'https://www.facebook.com/dialog/oauth?client_id=' + config.oauth.facebook.clientId +
          '&redirect_uri=' + config.oauth.facebook.callbackUrl + '&response_type=code&scope=email');
    }
    , 'GET /signin/facebook/callback': function *(next){
        if(this.query.error){
            this.redirect('/signin');
            return;
        }
        var tokenResonse = yield request.get(
            'https://graph.facebook.com/oauth/access_token?client_id=' + config.oauth.facebook.clientId +
            '&redirect_uri=' + config.oauth.facebook.callbackUrl +
            '&client_secret=' + config.oauth.facebook.clientSecret +
            '&code=' + this.query.code
        );

        var token = qs.parse(tokenResonse.body);
        if(!token.access_token){
            this.redirect('/signin');
            return;
        }

        var profileResponse = yield request.get(
            'https://graph.facebook.com/me?fields=name,email,picture&access_token=' + token.access_token
        );

        var profile = JSON.parse(profileResponse.body);
        var user = yield User.findOne({
            email: profile.email
        }, {
            _id: 1
            , name: 1
            , avatar: 1
        }).exec();

        if(!user){
            user = new User({
                email: profile.email
                , name: profile.name
                , avatar: gravatar(profile.email)
            });

            var result = yield (new Promise(function(resolve, reject){
                user.save(function(err, user){
                    if(err){
                        reject(err);
                    }
                    resolve(user);
                });
            }));
        }

        var showUser = only(user, [
            '_id'
            , 'name'
            , 'avatar'
        ]);

        var token = sign(showUser, {
                expireInMinutes: 90 * 24 * 60
            });

        this.redirect('/?user=' + encodeURIComponent(JSON.stringify({token: token, user: showUser})));
    }
    , 'GET /signin/google': function *(next){
        this.redirect(
          'https://accounts.google.com/o/oauth2/auth?client_id=' + config.oauth.google.clientId +
          '&redirect_uri=' + config.oauth.google.callbackUrl + '&response_type=code&scope=profile%20email');
    }
    , 'GET /signin/google/callback': function *(next){
        if(this.query.error){
            this.redirect('/signin');
            return;
        }

        var tokenResonse = yield request.post('https://accounts.google.com/o/oauth2/token', {
            form: {
                code: this.query.code
                , client_id: config.oauth.google.clientId
                , client_secret: config.oauth.google.clientSecret
                , redirect_uri: config.oauth.google.callbackUrl
                , grant_type: 'authorization_code'
            }
        });

        var token = JSON.parse(tokenResonse.body);
        if(!token.access_token){
            this.redirect('/signin');
            return;
        }

        var profileResponse = yield request.get(
            'https://www.googleapis.com/plus/v1/people/me?access_token=' + token.access_token
        );

        var profile = JSON.parse(profileResponse.body);
        var user = yield User.findOne({
            email: profile.emails[0].value
        }, {
            _id: 1
            , name: 1
            , avatar: 1
        }).exec();

        if(!user){
            user = new User({
                email: profile.emails[0].value
                , name: profile.displayName
                , avatar: gravatar(profile.emails[0].value)
            });

            var result = yield user.save().exec();
        }

        var showUser = only(user, [
            '_id'
            , 'name'
            , 'avatar'
        ]);

        var token = sign(showUser, {
                expireInMinutes: 90 * 24 * 60
            });

        this.redirect('/?user=' + encodeURIComponent(JSON.stringify({token: token, user: showUser})));
    }
};
