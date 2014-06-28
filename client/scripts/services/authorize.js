'use strict';

angular.module('kman')
.factory('Authorize', ['$q', 'localStorageService', function($q, localStorageService){
    var exports = {};
    exports.getUser = function(){
        var user = localStorageService.get('user');
        if(user){
            return user;
        }
    };

    exports.isAuthorized = function(){
        var user = exports.getUser();

        if(user){
            return $q.resolve({
                authorized: true
            });
        }else{
            return $q.reject({
                authorized: false
            });
        }
    }
    return exports;
}]);
