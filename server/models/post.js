var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

var PostSchema = Schema({
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'}
    , content: String
    , createdAt: Date
    , updatedAt: Date
    , comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

PostSchema.pre('save', function(next, done){
    if(this.isNew){
        this.createdAt = new Date();
    }
    this.updatedAt = new Date();
    next();
});


module.exports = mongoose.model('Post', PostSchema, 'posts');