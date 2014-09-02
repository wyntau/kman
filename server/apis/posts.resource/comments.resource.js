var Promise = require('bluebird')

    , Comment = require('../../models/comment')
    , Post = require('../../models/post')
    , authorize = require('../../middles/authorize')
    , socket = require('../../socket')

    ;

module.exports = {
    create: [authorize, function *(next){
        var body = this.request.body
            , postId = this.params.post
            , userId = this.user._id
            , comment
            ;

        body.belongTo = postId;
        body.createdBy = userId;

        var comment = new Comment(body);

        yield Post
        .findById(postId)
        .exec()
        .then(function(post){
            post.comments.push(comment);
            return Promise.promisify(post.save, post)();
        });

        comment = yield Promise.promisify(comment.save, comment)()
            .then(function(result){
                var comment = result[0];

                return Comment.populate(comment, {
                    path: 'createdBy'
                    , select: {
                        name: 1
                        , avatar: 1
                    }
                });
            });
        var io = socket.io();
        io.emit('comment', comment);

        this.status = 201;
        this.body = comment;
    }]
};
