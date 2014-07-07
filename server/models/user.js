var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

var UserSchema = Schema({
    email: String
    , platformId: String
    , platform: String
    , password: String
    , name: String
    , avatar: String
    , createdAt: Date
});

UserSchema.pre('save', function(next, done){
    if(this.isNew){
        this.createdAt = new Date();
    }
    next();
});

module.exports = mongoose.model('User', UserSchema, 'users');