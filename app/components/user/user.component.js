'use strict';

angular.module('myApp.user', ['ui.router'])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('view2.user', {
            url: '/{userId}',
            component: 'user',
            resolve: {
                user: ['$http', '$transition$', function ($http, $transition$) {
                    return $http.get('https://jsonplaceholder.typicode.com/users/')
                        .then(function (res) {
                            return res.data[$transition$.params().userId-1];
                        }, function (res) {
                            console.log(res);
                        });
                }]
            }
        });
    }])

    .component('user', {
        /*controller: [ '$scope', 'users', function ($scope, users) {
         $scope.users = users;
         }],*/
        bindings: {user: '<'},
        templateUrl: 'components/user/user.template.html'
    });