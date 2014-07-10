'use strict';
angular.module('kman')
.factory('Post', ['$resource', function($resource){
    return $resource('/resource/posts/:postId', {
        postId: '@_id'
    });
}]);