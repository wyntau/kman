var Resource = require('koa-resource-router')
    , Promise = require('bluebird')

    , Post = require('../models/post')
    , User = require('../models/user')
    , authorize = require('../middles/authorize')
    , socket = require('../socket')
    ;

module.exports = new Resource('posts', authorize, {
    index: function *(next){
        var posts = yield Post.find().limit(15).sort({
            createdAt: -1
        })
        .populate({
            path: 'comments'
            , select: {
                createdBy: 1
                , content: 1
                , createdAt: 1
            }
            , option: {
                limit: 15
                , sort: {
                    createdAt: -1
                }
            }
        })
        .populate({
            path: 'createdBy',
            select: {
                _id: 1
                , name: 1
                , avatar: 1
            }
        })
        .exec()
        .then(function(doc){
            return Post.populate(doc, {
                path: 'comments.createdBy'
                , model: 'User'
                , select: {
                    name: 1
                    , avatar: 1
                }
            });
        });

        this.body = posts;
    }
    , create: function *(next){
        var body = this.request.body
            , userId = this.user._id
            , post
            ;

        body.createdBy = userId;

        post = new Post(body);

        post = yield Promise.promisify(post.save, post)()
            .then(function(result){
                var post = result[0];
                return Post.populate(post, {
                    path: 'createdBy'
                    , select: {
                        name: 1
                        , avatar: 1
                    }
                });
            });
        var io = socket.io();
        io.emit('post', post);

        this.status = 201;
        this.body = post;
    }
});