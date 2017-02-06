'use strict';

// Declare app level module which depends on views, and components

var app = angular.module('myApp', [
  'ui.router',
  'oc.lazyLoad',
  'ngCookies',
  'ngMaterial',
  'ngMessages'
]);


app.run(['$transitions', '$rootScope', '$cookies', function ($transitions, $rootScope, $cookies) {
  $rootScope.globals =  angular.isString($cookies.get('globals')) ? JSON.parse($cookies.get('globals')) : {};
  //console.log($rootScope.globals);
  if( $rootScope.globals.currentUser ){
    //$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
  }

  $transitions.onStart({to:'dashboard.**'}, function (transition) {
    //console.log(transition, $rootScope.globals.currentUser);
    if( !$rootScope.globals.currentUser )
      return transition.router.stateService.target('login');
  });
  $transitions.onStart({to:'login'},function (transition) {
    //console.log(transition, $rootScope.globals.currentUser);
    if( $rootScope.globals.currentUser )
      return transition.router.stateService.target('dashboard.express-overhead');
  });
  $transitions.onStart({to:'registration'},function (transition) {
    //console.log(transition, $rootScope.globals.currentUser);
    if( $rootScope.globals.currentUser )
      return transition.router.stateService.target('dashboard.express-overhead');
  });
}]);

