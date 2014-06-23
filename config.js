var path = require('path')
    , _ = require('lodash')

    , domain = 'http://kmanjs.com'

    , secret = 'kmansecret'

    , rootPath = __dirname
    , clientDir = 'client'
    , serverDir = 'server'
    , serverPath = path.join(rootPath, serverDir)
    , clientPath = path.join(rootPath, clientDir)
    , indexFile = 'index.html'
    , apiPrefix = '/api'

    , imagesDir = 'images'
    , scriptsDir = 'scripts'
    , bowerComponentsDir = 'bower_components'
    , viewsDir = 'views'
    , stylesDir = 'styles'
    , devStylesDir = 'styles'

    , port = 3000
    , devPort = 3000
    , testPort = 3001

    , DBName = 'kman'
    , devDBName = 'kmandev'
    , testDBName = 'kmantest'

    , googleClientId = '280611452741-apjn650lstej7sc5cm0v4u3e2cr07imm.apps.googleusercontent.com'
    , googleClientSecret = 'v5xQ3pCT2KVkWnTSxk7aCVfF'
    , googleCallbackPath = '/signin/google/callback'

    , facebookClientId = '644645675629755'
    , facebookClientSecret = '1037128b8458bc4599496f93918d4887'
    , facebookCallbackPath = '/signin/facebook/callback'

    ;

var baseConfig = {
    secret: secret
    , env: process.env.NODE_ENV
    , app: {
        root: rootPath
        , client: clientPath
        , server: serverPath
        , indexFile: indexFile
        , apiPrefix: apiPrefix
    }
    , asserts: {
        images: path.join(clientPath, imagesDir)
        , scripts: path.join(clientPath, scriptsDir)
        , bower_components: path.join(clientPath, bowerComponentsDir)
        , views: path.join(clientPath, viewsDir)
    }
};

var envConfig = {
    development: {
        app: {
            port: devPort
        }
        , asserts: {
            styles: path.join(clientPath, devStylesDir)
        }
        , minifier: {
            collapseWhitespace: false
            , removeComments: false
        }
        , mongo: {
            url: 'mongodb://localhost:27017/' + devDBName
        }
        , oauth: {
            facebook: {
                clientId: facebookClientId
                , clientSecret: facebookClientSecret
                , callbackUrl: 'http://localhost:' + devPort + facebookCallbackPath
            }
            , google: {
                clientId: googleClientId
                , clientSecret: googleClientSecret
                , callbackUrl: 'http://localhost:' + devPort + googleCallbackPath
            }
        }
    }
    , test: {
        app: {
            port: testPort
        }
        , mongo: {
            url: 'mongodb://localhost:27017/' + testDBName
        }
    }
    , production: {
        app: {
            port: process.env.PORT || port
            , cacheTime: 7 * 24 * 60 * 60 * 1000 /* default caching time (7 days) for static files, calculated in milliseconds */
        }
        , asserts: {
            styles: path.join(clientPath, stylesDir)
        }
        , minifier: {
            collapseWhitespace: true
            , removeComments: true
        }
        , mongo: {
            url: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || ('mongodb://localhost:27017/' + DBName)
        }
        , oauth: {
            facebook: {
                clientId: facebookClientId
                , clientSecret: facebookClientSecret
                , callbackUrl: domain + facebookCallbackPath
            }
            , google: {
                clientId: googleClientId
                , clientSecret: googleClientSecret
                , callbackUrl: domain + googleCallbackPath
            }
        }
    }
};

// override the base configuration with the platform specific values
module.exports = _.merge(baseConfig, envConfig[baseConfig.env || (baseConfig.env = 'development')]);