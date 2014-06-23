var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

var User = Schema({
    email: String
    , password: String
    , name: String
    , avatar: String
});

module.exports = mongoose.model('User', User, 'users');