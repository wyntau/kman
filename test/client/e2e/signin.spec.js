'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
chai.use(chaiAsPromised);

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('KMAN app', function() {

  browser.get('/');

  it('should automatically redirect to /signin.html when user is not authenticated', function() {
    expect(browser.getLocationAbsUrl()).to.eventually.match(/\/signin.html$/);
  });

});