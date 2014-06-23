'use strict';
angular.module('kman')
.controller('profileCtrl', ['$scope', function($scope){
    $scope.user = $scope.common.user;
}]);