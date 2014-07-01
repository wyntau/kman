var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

var Post = Schema({
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'}
    , content: String
    , createdAt: Date
    , updatedAt: Date
    , comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

module.exports = mongoose.model('Post', Post, 'posts');