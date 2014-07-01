'use strict';

angular.module('kman')
.factory('Authorize', ['$q', 'localStorageService', function($q, localStorageService){
    var exports = {};
    exports.getUser = function(){
        return localStorageService.get('user');
    };

    exports.getToken = function(){
        return localStorageService.get('token');
    };

    exports.isAuthorized = function(){
        var deferred = $q.defer();
        var user = exports.getUser();
        var token = exports.getToken();

        if(user && token){
            deferred.resolve({
                authorized: true
            });
        }else{
            deferred.reject({
                authorized: false
            });
        }
        return deferred.promise;
    };
    return exports;
}]);
