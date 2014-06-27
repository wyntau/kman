var passport = require('koa-passport')
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , WeiboStrategy = require('passport-weibo').Strategy
    , config = require('../../config')
    ;

passport.use(new FacebookStrategy({
    clientID: config.oauth.facebook.clientID
    , clientSecret: config.oauth.facebook.clientSecret
    , callbackURL: config.oauth.facebook.callbackURL
}, function(token, tokenSecret, profile, done){
    done(null, profile);
}));

passport.use(new GoogleStrategy({
    clientID: config.oauth.google.clientID
    , clientSecret: config.oauth.google.clientSecret
    , callbackURL: config.oauth.google.callbackURL
}, function(token, refreshToken, profile, done){
    done(null, profile);
}));

passport.use(new WeiboStrategy({
    clientID: config.oauth.weibo.clientID
    , clientSecret: config.oauth.weibo.clientSecret
    , callbackURL: config.oauth.weibo.callbackURL
    , authorizationURL: 'https://api.weibo.com/oauth2/authorize'
    , tokenURL: 'https://api.weibo.com/oauth2/access_token'
}, function(accessToken, refreshToken, profile, done){
    done(profile);
}));

module.exports = passport;