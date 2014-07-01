var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

var Comment = Schema({
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'}
    , belongTo: {type: Schema.Types.ObjectId, ref: 'Post'}
    , createdAt: Date
    , content: String
});

module.exports = mongoose.model('Comment', Comment, 'comments');
