// A reference configuration file.
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:3000',
    chromeDriver: '../../node_modules/protractor/selenium/chromedriver',
    framework: 'mocha',
    specs: [
        'e2e/spec/**/*.js'
    ],
    mochaOpts: {
        ui: 'bdd',
        reporter: 'spec'
    }
};