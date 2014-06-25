'use strict';

angular.module('kman')
.factory('Socket', ['socketFactory', function(socketFactory){
    return socketFactory();
}])