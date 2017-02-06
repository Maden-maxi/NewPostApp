'use strict';

angular.module('myApp.view2', [])

.component('viewComponent2', {
  /*controller: [ '$scope', 'users', function ($scope, users) {
    $scope.users = users;
  }],*/
  bindings: {users: '<'},
  templateUrl: 'view2/view2.html'
});