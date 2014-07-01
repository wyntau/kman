var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

var CommentSchema = Schema({
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'}
    , belongTo: {type: Schema.Types.ObjectId, ref: 'Post'}
    , createdAt: Date
    , content: String
});

CommentSchema.pre('save', function(next, done){
    if(this.isNew){
        this.createdAt = new Date();
    }
    next();
});

module.exports = mongoose.model('Comment', CommentSchema, 'comments');
