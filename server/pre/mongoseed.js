var mongoose = require('mongoose')
    , ObjectId = mongoose.Types.ObjectId
    , Promise = require('bluebird')
    , async = require('async')
    , User = require('../models/user')
    , Post = require('../models/post')
    , Comment = require('../models/comment')
    , gravatar = require('gravatar').url
    ;

module.exports = function(override){

    return User
        .count()
        .exec()
        .then(function(length){
            if(!override && length !== 0){
                return Promise.resolve('not override');
            }
            return Promise.all([
                Promise.promisify(User.remove, User)({})
                , Promise.promisify(Comment.remove, Comment)({})
                , Promise.promisify(Post.remove, Post)({})
            ])
            .then(function(){
                var users = [
                    new User({
                        email: 'admin@kmanjs.com'
                        , password: 'pass'
                        , name: 'Kman Demo'
                        , avatar: gravatar('admin@kmanjs.com')
                    })
                    , new User({
                        email: 'jeremial@kmanjs.com'
                        , password: 'pass'
                        , name: 'Jeremial Lau'
                        , avatar: gravatar('jeremial@kmanjs.com')
                    })
                ];

                var posts = [
                    new Post({
                        created_by: users[0]._id
                        , content: 'Hi there! This is a sample post demonstrating a KMAN app. KMAN is a simple boilerplate for building full-stack JavaScript Web applications using Koa, AngularJS, and Node.js. It utilizes WebSockets to provide real-time communication between servers and clients. MongoDB is used for data persistence and Passport.js for social logins. There are also numerous Grunt tasks pre-bundled and configured to facilitate development and testing. You can open this site in multiple browser tabs and post something to see how real-time communication works. You can also browse the project’s GitHub page to start building KMAN apps yourself.'
                        , created_at: new Date()
                    })
                ];

                var comments = [
                    new Comment({
                        created_by: users[1]._id
                        , belong_to: posts[0]._id
                        , created_at: new Date()
                        , content: 'Also remember that, if you can read this, you are within range of Chuck!'
                    })
                    , new Comment({
                        created_by: users[0]._id
                        , belong_to: posts[0]._id
                        , created_at: new Date()
                        , content: 'Ow yeah!'
                    })
                ];

                comments.forEach(function(comment){
                    posts[0].comments.push(comment);
                });

                var all = [];

                users.forEach(function(user){
                    all.push(Promise.promisify(user.save, user)());
                });
                posts.forEach(function(post){
                    all.push(Promise.promisify(post.save, post)());
                });
                comments.forEach(function(comment){
                    all.push(Promise.promisify(comment.save, comment)());
                });

                return Promise.all(all);
            });
        });
};

