var Resource = require('koa-resource-router')
    , Post = require('../models/post')
    , User = require('../models/user')
    , authorize = require('../middles/authorize')
    , mongoose = require('mongoose')
    , ObjectId = mongoose.Types.ObjectId
    ;

module.exports = new Resource('posts', {
    index: function *(next){
        var posts = yield Post.find().limit(15)
        .populate({
            path: 'comments'
            , select: {
                created_by: 1
                , content: 1
                , created_at: 1
            }
            , option: {
                limit: 15
                , sort: {
                    created_at: -1
                }
            }
        })
        .populate({
            path: 'created_by',
            select: {
                _id: 1
                , name: 1
                , avatar: 1
            }
        })
        .exec()
        .then(function(doc){
            return Post.populate(doc, {
                path: 'comments.created_by'
                , model: 'User'
                , select: {
                    name: 1
                    , avatar: 1
                }
            });
        });

        this.body = posts;
    }
    , create: [authorize(), function *(next){
        var body = this.request.body
            , userId = this.user._id
            , post
            ;

        body.created_by = userId; //new ObjectId(userId);
        body.created_at = new Date();

        post = new Post(body);

        yield post.save().exec();

        this.status = 201;
        this.body = post;
    }]
});