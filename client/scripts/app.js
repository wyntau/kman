'use strict';

angular.module('kman', [
    'ui.router',
    'monospaced.elastic',
    'ngResource',
    'LocalStorageModule',
    'btford.socket-io'
])
.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'localStorageServiceProvider', function($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider){
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('home', {
            url: '^/',
            templateUrl: '/views/home.html',
            controller: 'homeCtrl',
            data: {
                title: 'KMAN Home',
                ctrl: 'home'
            }
        })
        .state('profile', {
            url: '^/profile',
            templateUrl: '/views/profile.html',
            controller: 'profileCtrl',
            data: {
                title: 'User Profile',
                ctrl: 'profile'
            }
        });

    $urlRouterProvider.otherwise('/');

    $httpProvider.interceptors.push('HttpInterceptor');

    localStorageServiceProvider.setPrefix('');

}])
.run(['$location', '$rootScope', '$window', '$http', function($location, $rootScope, $window, $http){
    var common = $rootScope.common = $rootScope.common || {
        active: {},
        user: JSON.parse($window.sessionStorage.user || $window.localStorage.user),
        logout: function(){
            delete $window.sessionStorage.token;
            delete $window.sessionStorage.user;
            delete $window.localStorage.token;
            delete $window.localStorage.user;
            $window.location.replace('/signin.html');
        },
        clearDatabase: function(){
            var self = this;
            $http.post('/debug/cleardatabase').then(function(){
                console.log('post success');
                self.logout();
            });
        }
    };

    // api.connected.subscribe(function(){
    //     common.onlineIndicatorStyle = {'background-color': 'green'};
    // });

    // api.disconnected.subscribe(function(){
    //     common.onlineIndicatorStyle = {'background-color': 'lightgrey'};
    // });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, formParams){
        $rootScope.common.title = toState.data.title;

        $rootScope.common.active = {};
        $rootScope.common.active[toState.data.ctrl] = 'active';
    });
}]);
