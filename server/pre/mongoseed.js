var Promise = require('bluebird')
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
                        , name: 'Kman'
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
                        createdBy: users[0]._id
                        , content: '这是KMAN的示例程序. KMAN后端使用Koa.js + MongoDB(mongoose) + Node.js, 前端使用Angular.js. socket.io负责完成多个客户端与服务端的实时通信, passport.js负责多个第三方登录的授权认证. 你可以打开多个浏览器窗口, 在其中一个窗口中发表一段文字或者一条评论, 在另一个窗口中就可以看到相同的内容出现. KMAN同时提供了预先设定好的Grunt任务, 可以实时刷新浏览器查看修改过的内容, 并能够快速进行单元(unit)测试, 端对端(e2e)测试, 打包, 只需一个grunt指令即可完成. 具体内容可以打开页面下文的Github链接进行查看.'
                    })
                ];

                var comments = [
                    new Comment({
                        createdBy: users[1]._id
                        , belongTo: posts[0]._id
                        , content: '记得star一下~~'
                    })
                    , new Comment({
                        createdBy: users[0]._id
                        , belongTo: posts[0]._id
                        , content: '32个赞~~'
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

