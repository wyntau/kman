var Resource = require('koa-resource-router')
    , Comment = require('../models/comment')
    , postResource = require('./post')
    , mongoose = require('mongoose')
    , authorize = require('../middles/authorize')
    , ObjectId = mongoose.Types.ObjectId
    ;

var commentResource = new Resource('comments', {
    create: [authorize(), function *(next){
        var body = this.request.body
            , postId = this.params.post
            , userId = this.user._id
            , comment
            ;

        body.belong_to = postId; //new ObjectId(postId);
        body.created_by = userId; //new ObjectId(userId)
        body.created_at = new Date();

        var comment = new Comment(body);

        yield comment.save().exec();

        this.status = 201;
        this.body = comment;
    }]
});

postResource.add(commentResource);

module.exports = commentResource;