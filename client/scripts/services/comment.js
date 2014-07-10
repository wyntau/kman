'use strict';
angular.module('kman')
.factory('Comment', ['$resource', function($resource){
    return $resource('/resource/posts/:postId/comments/:commentId', {
        postId: '@belongTo',
        commentId: '@_id'
    });
}]);