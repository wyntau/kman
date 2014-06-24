var Resource = require('koa-resource-router')
    , Comment = require('../models/comment')
    , Post = require('../models/post')
    , postResource = require('./post')
    , authorize = require('../middles/authorize')
    , Promise = require('bluebird')
    ;

var commentResource = new Resource('comments', {
    create: [authorize, function *(next){
        var body = this.request.body
            , postId = this.params.post
            , userId = this.user._id
            , comment
            ;

        body.belong_to = postId; //new ObjectId(postId);
        body.created_by = userId; //new ObjectId(userId)
        body.created_at = new Date();

        var comment = new Comment(body);

        yield Post
        .findById(postId)
        .exec()
        .then(function(post){
            post.comments.push(comment);
            return new Promise(function(resolve, reject){
                post.save(function(err, post){
                    resolve(post);
                });
            });
        });

        comment = yield (new Promise(function(resolve, reject){
            comment.save(function(err, comment){
                Comment.populate(comment, {
                    path: 'created_by'
                    , select: {
                        name: 1
                        , avatar: 1
                    }
                }).then(function(comment){
                    resolve(comment);
                });
            });
        }));

        this.status = 201;
        this.body = comment;
    }]
});

postResource.add(commentResource);

module.exports = commentResource;