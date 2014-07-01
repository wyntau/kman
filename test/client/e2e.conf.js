// A reference configuration file.
exports.config = {
    baseUrl: 'http://localhost:3000',
    chromeDriver: '../../node_modules/protractor/selenium/chromedriver',
    framework: 'mocha',
    specs: [
        'e2e/*.spec.js'
    ]
};