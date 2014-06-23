'use strict';
angular.module('kman')
.controller('homeCtrl', ['$scope', 'Post', 'Comment', function($scope, Post, Comment){
    var user = $scope.common.user;

    $scope.postBox = {
        content: '',
        disabled: false
    };

    $scope.posts = [];

    Post.query().$promise.then(function(posts){
        posts.forEach(function(post){
            post.commentBox = {
                content: '',
                disabled: false
            };
            post.comments = post.comments || [];
        });
        $scope.posts = posts;
    });

    $scope.createPost = function(){
        $scope.postBox.disabled = true;
        var post = new Post({
            content: $scope.postBox.content,
            created_by: user._id
        });

        post.$save(function(post){
            $scope.postBox.content = '';
            $scope.postBox.disabled = false;
            post.commentBox = {
                content: '',
                disabled: false
            };
            $scope.posts.unshift(post);
        });
    };

    $scope.createComment = function($event, post){
        if($event.keyCode !== 13){
            return;
        }

        if(!post.commentBox.content.length || post.commentBox.disabled){
            $event.preventDefault();
            return;
        }

        post.commentBox.disabled = true;

        var comment = new Comment({
            content: post.commentBox.content,
            created_by: user._id,
            belong_to: post._id
        });

        comment.$save(function(comment){
            post.commentBox.content = '';
            post.commentBox.disabled = false;
            post.comments.push(comment);
        });
    };


}]);