describe('demo suite', function() {
    beforeEach(function() {
        module('kman');
        module('localstorage-mock');
    });

    it('should return token and user success', inject(function(localStorageService) {
        localStorageService.get('token').should.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1M2IyZDFiM2ZlMTlkMTc4MmU1MWJiODAiLCJuYW1lIjoi562J5aazLOWcqOmbqOS4rSIsImF2YXRhciI6Imh0dHA6Ly9xLnFsb2dvLmNuL3FxYXBwLzEwMTEzNTQ3OS82RTQyODMxNDhFODBENTVBOUMyNTMwQ0VFQTFCOUZFOC8xMDAiLCJpYXQiOjE0MDQyMjgwMTl9.nxpYSJiU81-vEiYUlHNzBot6hqR9F8fc_dVWPbpvIiA');
        localStorageService.get('user').should.deep.equal({
            "__v": 0,
            "createdAt": "2014-07-01T15:20:19.319Z",
            "platform": "qq",
            "platformId": "6E4283148E80D55A9C2530CEEA1B9FE8",
            "name": "等妳,在雨中",
            "avatar": "http://q.qlogo.cn/qqapp/101135479/6E4283148E80D55A9C2530CEEA1B9FE8/100",
            "_id": "53b2d1b3fe19d1782e51bb80"
        });
    }));

    it('should return posts list', inject(function($controller, $rootScope, $httpBackend) {
        var $scope = $rootScope.$new();
        var authorized = {
            authorized: true
        };
        $httpBackend.when('GET', '/resource/posts').respond([{
            _id: '1',
            content: 'content',
            createdBy: 'author',
            createdAt: new Date()
        }]);
        var homeCtrl = $controller('homeCtrl', {
            $scope: $scope,
            authorized: authorized
        });

        $httpBackend.flush();

        $scope.posts.length.should.equal(1);
    }));

    it('should get profile', inject(function($controller, $rootScope){
        var authorized = {
            authorized: true
        };
        var $scope = $rootScope.$new();
        var profileCtrl = $controller('profileCtrl', {
            $scope: $scope,
            authorized: authorized
        });

        $scope.user.should.deep.equal({
            "__v": 0,
            "createdAt": "2014-07-01T15:20:19.319Z",
            "platform": "qq",
            "platformId": "6E4283148E80D55A9C2530CEEA1B9FE8",
            "name": "等妳,在雨中",
            "avatar": "http://q.qlogo.cn/qqapp/101135479/6E4283148E80D55A9C2530CEEA1B9FE8/100",
            "_id": "53b2d1b3fe19d1782e51bb80"
        });
    }));
});