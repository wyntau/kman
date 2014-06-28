'use strict';
angular.module('kman')
.controller('profileCtrl', ['authorized', '$scope', function(authorized, $scope){
    $scope.user = $scope.common.user;
}]);