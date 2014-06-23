'use strict';
angular.module('kman')
.factory('HttpInterceptor', ['localStorageService', function(localStorageService){
    return {
        request: function(config){
            config.headers = config.headers || {};
            var token = localStorageService.get('token');
            if(token){
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        }
    };
}]);