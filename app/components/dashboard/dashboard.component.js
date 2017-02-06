'use strict';

angular.module('myApp.dashboard', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/dashboard', '/dashboard/history');
    $stateProvider.state('dashboard', {
      abstract: true,
      redirectTo: {state: 'dashboard.express-overhead'},
      url: '/dashboard',
      component: 'dashboard',
      resolve: {
        lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load(['components/history/history.component.js', 'components/express-overhead/express-overhead.component.js'])
        }]
      }
    });
  }])

  .component('dashboard', {
    /*controller: [ '$scope', function ($scope) {

     }],*/
    bindings: {username: '<'},
    templateUrl: 'components/dashboard/dashboard.template.html'
  });