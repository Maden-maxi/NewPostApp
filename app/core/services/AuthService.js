angular.module('auth', [])
.factory( 'Auth', [ '$rootScope', '$http', '$q', '$cookies', function ($rootScope, $http, $q, $cookies) {
    var self = this;

    self.Login = function (credentials, success, error) {
        $http.post('/user/login', credentials).then(function (response) {
            success(response);
        }, function (err) {
            error(err);
        });
    };

    self.SetCredentials = function (cookie, user) {
        localStorage.setItem('user', JSON.stringify(user));
        $rootScope.globals = {
            currentUser: {
                user_id: cookie.user_id,
                authdata: cookie.authdata
            }
        };
        //$http.defaults.headers.common['Authorization'] = 'Basic ' + cookie.authdata;
        $cookies.putObject('globals', $rootScope.globals);
    };

    self.ClearCredentials = function () {
        localStorage.removeItem('user');
        $rootScope.globals = {};
        $cookies.remove('globals');
        //$http.defaults.headers.common.Authorization = 'Basic ';
    };

    return self;
}]);

