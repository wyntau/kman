var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

var Comment = Schema({
    created_by: {type: Schema.Types.ObjectId, ref: 'User'}
    , belong_to: {type: Schema.Types.ObjectId, ref: 'Post'}
    , created_at: Date
    , content: String
});

module.exports = mongoose.model('Comment', Comment, 'comments');
