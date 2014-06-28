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
        var deferred = $q.defer();
        var user = exports.getUser();

        if(user){
            deferred.resolve({
                authorized: true
            });
        }else{
            deferred.reject({
                authorized: false
            });
        }
        return deferred.promise;
    }
    return exports;
}]);
