var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

var Post = Schema({
    created_by: {type: Schema.Types.ObjectId, ref: 'User'}
    , content: String
    , created_at: Date
    , updated_at: Date
    , comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

module.exports = mongoose.model('Post', Post, 'posts');