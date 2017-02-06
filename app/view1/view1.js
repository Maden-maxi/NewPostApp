'use strict';

angular.module('myApp.view1', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  /*$stateProvider.state('view1',{
    url: '/view1',
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl',
    resolve: {
      users: ['$http', '$q', function ($http, $q) {
        return $http.get('https://jsonplaceholder.typicode.com/posts')
        .then(function (res) {
          return res.data;
        }, function (res) {
          console.log(res);
        });
      }],
      lazyLoadView: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load(['view1/view1.js']);
      }]
    }
  });*/

}])

.controller('View1Ctrl', [ '$scope', 'users', '$state', function($scope, users, $state) {
  $scope.posts = users;
}]);