app.config(['$locationProvider', '$urlRouterProvider', '$stateProvider', '$ocLazyLoadProvider', function($locationProvider, $urlRouterProvider, $stateProvider, $ocLazyLoadProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');

  $urlRouterProvider.otherwise('/');
  var path = {
    getCompoment: function (name) {
      return 'components/' + name + '/' + name + '.components.js';
    }
  };
  var modules = [
    {name: "root", file: [path.getCompoment('login'), path.getCompoment('registration')]},
    {name: "dashboard", file: [path.getCompoment('express-overhead'), path.getCompoment('history')]},
    {name: "view1Module", files: ["view1/view1.js", "components/dashboard/dashboard.component.js", "components/express-overhead/express-overhead.component.js"]},
    {name: "view2Module", files: ['view2/view2.js', 'components/user/user.component.js','components/login/login.component.js', 'components/registration/registration.component.js']}
  ];

  $ocLazyLoadProvider.config({
    debug: true,
    events: true,
    modules: modules
  });
  var states = [
    {
      name: "home",
      url: "/",
      templateUrl: "core/templates/index.template.html",
      controller: "AppCtrl",
      resolve: {
        lazyLoad: ["$ocLazyLoad", function ($ocLazyLoad) {
          return $ocLazyLoad.load("root");
        }]
      }
    }
  ];
  /*

  $stateProvider.state('view1', {
    url: '/',
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
        return $ocLazyLoad.load('view1Module');
      }]
    }
  }).state('view2', {
    url: '/view2',
    component: 'viewComponent2',
    resolve: {
      users: ['$http', function ($http) {
        return $http.get('https://jsonplaceholder.typicode.com/users')
          .then(function (res) {
            return res.data;
          }, function (res) {
            console.log(res);
          });
      }],
      lazyLoadUser: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load('view2Module');
      }]
    }
  }).state('registration', {
    url: '/registration',
    component: 'registration',
    resolve: {
      registration: function () {
        return 'Hello user please log in!'
      }
    }
  }).state('login', {
    url: '/login',
    component: 'login',
    resolve: {
      login: function () {
        return 'Hello user please log in!'
      }
    }
  });
  */
}]).run(['$ocLazyLoad', function ($ocLazyLoad) {
  $ocLazyLoad.load(['components/version/version.js','components/version/version-directive.js','components/version/interpolate-filter.js']);
}]);