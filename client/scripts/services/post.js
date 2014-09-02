'use strict';
angular.module('kman')
.factory('Post', ['$resource', function($resource){
    return $resource('/api/posts/:postId', {
        postId: '@_id'
    });
}]);