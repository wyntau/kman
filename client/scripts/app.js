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
.run(['$location', '$rootScope', '$window', '$http', 'Socket',function($location, $rootScope, $window, $http, Socket){
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

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, formParams){
        $rootScope.common.title = toState.data.title;

        $rootScope.common.active = {};
        $rootScope.common.active[toState.data.ctrl] = 'active';
    });

    Socket.on('online', function(){
        console.log('connection');
        $rootScope.common.onlineIndicatorStyle = {'background-color': 'green'};
    });

    Socket.on('offline', function(){
        $rootScope.common.onlineIndicatorStyle = {'background-color': 'lightgrey'};
    });

    console.log('          _____                    _____                    _____                    _____\n         /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\\n        /::\\____\\                /::\\____\\                /::\\    \\                /::\\____\\\n       /:::/    /               /::::|   |               /::::\\    \\              /::::|   |\n      /:::/    /               /:::::|   |              /::::::\\    \\            /:::::|   |\n     /:::/    /               /::::::|   |             /:::/\\:::\\    \\          /::::::|   |\n    /:::/____/               /:::/|::|   |            /:::/__\\:::\\    \\        /:::/|::|   |\n   /::::\\    \\              /:::/ |::|   |           /::::\\   \\:::\\    \\      /:::/ |::|   |\n  /::::::\\____\\________    /:::/  |::|___|______    /::::::\\   \\:::\\    \\    /:::/  |::|   | _____\n /:::/\\:::::::::::\\    \\  /:::/   |::::::::\\    \\  /:::/\\:::\\   \\:::\\    \\  /:::/   |::|   |/\\    \\\n/:::/  |:::::::::::\\____\\/:::/    |:::::::::\\____\\/:::/  \\:::\\   \\:::\\____\\/:: /    |::|   /::\\____\\\n\\::/   |::|~~~|~~~~~     \\::/    / ~~~~~/:::/    /\\::/    \\:::\\  /:::/    /\\::/    /|::|  /:::/    /\n \\/____|::|   |           \\/____/      /:::/    /  \\/____/ \\:::\\/:::/    /  \\/____/ |::| /:::/    /\n       |::|   |                       /:::/    /            \\::::::/    /           |::|/:::/    /\n       |::|   |                      /:::/    /              \\::::/    /            |::::::/    /\n       |::|   |                     /:::/    /               /:::/    /             |:::::/    /\n       |::|   |                    /:::/    /               /:::/    /              |::::/    /\n       |::|   |                   /:::/    /               /:::/    /               /:::/    /\n       \\::|   |                  /:::/    /               /:::/    /               /:::/    /\n        \\:|   |                  \\::/    /                \\::/    /                \\::/    /\n         \\|___|                   \\/____/                  \\/____/                  \\/____/\n');
}]);
