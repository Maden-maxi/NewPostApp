'use strict';

angular.module('myApp.expressOverhead', ['ui.router'])

  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('dashboard.express-overhead', {
      url: '/express-overhead',
      component: 'expressOverhead',
      resolve: {
        username: ['$transition$', function ($transition$) {
          return $transition$.params().someData;
        }]
      }
    });
  }])

  .component('expressOverhead', {
    /*controller: [ '$scope', function ($scope) {

     }],*/
    bindings: {username: '<'},
    templateUrl: 'components/express-overhead/express-overhead.template.html'
  });