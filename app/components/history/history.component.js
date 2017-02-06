'use strict';

angular.module('myApp.history', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('dashboard.history', {
      url: '/history',
      component: 'history',
      resolve: {
        username: ['$transition$', function ($transition$) {

        }]
      }
    });
  }])

  .component('history', {
    /*controller: [ '$scope', function ($scope) {

     }],*/
    bindings: {username: '<'},
    templateUrl: 'components/history/history.template.html'
  });