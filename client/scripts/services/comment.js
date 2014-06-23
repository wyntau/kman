angular.module('kman')
.factory('Comment', ['$resource', function($resource){
    return $resource('/api/posts/:postId/comments/:commentId', {
        postId: '@postId',
        commentId: '@commentId'
    });
}]);