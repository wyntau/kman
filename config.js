var path = require('path')
    , _ = require('lodash')

    , root = __dirname

    , domain = 'http://kmanjs.com'
    , secret = 'kmansecret'

    , googleCallbackPath = '/signin/google/callback'
    , facebookCallbackPath = '/signin/facebook/callback'
    , weiboCallbackPath = '/signin/weibo/callback'
    , qqCallbackPath = '/signin/qq/callback'

    ;

var baseConfig = {
    secret: secret
    , env: process.env.NODE_ENV
    , root: root
    , asserts: {
        images: path.join(root, 'client/images')
        , scripts: path.join(root, 'client/scripts')
        , bower_components: path.join(root, 'client/bower_components')
        , views: path.join(root, 'client/views')
        , fonts: path.join(root, 'client/fonts')
    }
    , oauth: {
        facebook: {
            clientID: '644645675629755'
            , clientSecret: '1037128b8458bc4599496f93918d4887'
        }
        , google: {
            clientID: '280611452741-apjn650lstej7sc5cm0v4u3e2cr07imm.apps.googleusercontent.com'
            , clientSecret: 'v5xQ3pCT2KVkWnTSxk7aCVfF'
        }
        , weibo: {
            clientID: '61912456'
            , clientSecret: 'efd9b75e9f4ce3d9d25ffeaac8194700'
        }
        , qq: {
            clientID: '101135479'
            , clientSecret: '8daf20cf8818fc26a023316446331e21'
        }
    }
};

var envConfig = {
    development: {
        app: {
            port: 3000
        }
        , asserts: {
            styles: path.join(root, 'client/.tmp/styles')
        }
        , minifier: {
            collapseWhitespace: false
            , removeComments: false
        }
        , mongo: {
            url: 'mongodb://localhost:27017/kmandev'
        }
        , oauth: {
            facebook: {
                callbackURL: 'http://localhost:3000' + facebookCallbackPath
            }
            , google: {
                callbackURL: 'http://localhost:3000' + googleCallbackPath
            }
            , weibo: {
                callbackURL: 'http://localhost:3000' + weiboCallbackPath
            }
            , qq: {
                callbackURL: 'http://localhost:3000' + qqCallbackPath
            }
        }
    }
    , test: {
        app: {
            port: 3001
        }
        , mongo: {
            url: 'mongodb://localhost:27017/kmantest'
        }
    }
    , production: {
        app: {
            port: process.env.PORT || 3000
            , cacheTime: 7 * 24 * 60 * 60 * 1000 /* default caching time (7 days) for static files, calculated in milliseconds */
        }
        , asserts: {
            styles: path.join(root, 'client/styles')
        }
        , minifier: {
            collapseWhitespace: true
            , removeComments: true
        }
        , mongo: {
            url: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || ('mongodb://localhost:27017/kman')
        }
        , oauth: {
            facebook: {
                callbackURL: domain + facebookCallbackPath
            }
            , google: {
                callbackURL: domain + googleCallbackPath
            }
            , weibo: {
                callbackURL: domain + weiboCallbackPath
            }
            , qq: {
                callbackURL: domain + qqCallbackPath
            }
        }
    }
};

// override the base configuration with the platform specific values
module.exports = _.merge(baseConfig, envConfig[baseConfig.env || (baseConfig.env = 'development')]);