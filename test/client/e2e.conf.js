// A reference configuration file.
var path = require('path')
    , os = require('os')
    , platform = os.platform()
    , suffix = /^win/.test(platform) ? '.exe' : ''
    , protractorPath = path.resolve(__dirname, '../../', 'node_modules/protractor')
    , protractorPKG = path.join(protractorPath, 'package.json')
    , versions = require(protractorPKG).webdriverVersions
    , seleniumServerJar = path.join(protractorPath, 'selenium/selenium-server-standalone-' + versions.selenium + '.jar')
    , chromedriver = path.join(protractorPath, 'selenium/chromedriver' + suffix)
    ;

exports.config = {
    baseUrl: 'http://localhost:3000',
    seleniumServerJar: seleniumServerJar,
    chromeDriver: chromedriver,
    framework: 'mocha',
    specs: [
        'e2e/spec/**/*.js'
    ],
    mochaOpts: {
        ui: 'bdd',
        reporter: 'spec'
    }
};