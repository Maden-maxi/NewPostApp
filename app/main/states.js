app.config(['$urlRouterProvider', '$stateProvider', '$ocLazyLoadProvider', '$locationProvider', function ($urlRouterProvider, $stateProvider, $ocLazyLoadProvider, $locationProvider) {

  /*
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  */
  $locationProvider.html5Mode(false).hashPrefix('!');

  $urlRouterProvider.otherwise('/');
  var path = {
    ctrl: function (name) {
      return 'main/controllers/'+ name + 'Ctrl.js';
    },
    tpl: function (name) {
      return 'main/templates/' + name + '.tpl.html';
    },
    service: function (name) {
      return 'core/services/' + name + '.js';
    },
    bower: function (pathname) {
      return 'bower_components/' + pathname;
    }
  };

  var modules = [
    {name: "indexModule", files: [path.ctrl("Index"), path.ctrl("Login"), path.ctrl("Registration") ]},
    {name: "regModule", files: [path.ctrl("Registration"), path.bower('angular-ui-mask/dist/mask.js'), path.service("NewPostService"), path.service("DbService")]},
    {name: "loginModule", files: [path.ctrl("Login"), path.service('AuthService')]},
    {name: "dashboardModule", files: [path.ctrl("Dashboard"), path.ctrl("ExpressOverhead"), path.bower('angular-ui-mask/dist/mask.js'), path.service("NewPostService"),path.service('AuthService'), path.service("DbService"), path.ctrl("History") ] }
  ];

  $ocLazyLoadProvider.config({
    modules: modules
  });

  $urlRouterProvider.otherwise('/');

  $stateProvider.state('index',{
    url: '/',
    templateUrl: path.tpl('index'),
    controller: 'IndexCtrl',
    data: {
      title: 'Нова Пошта! Доставка майбутнього!'
    },
    resolve: {
      lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load('indexModule');
      }]
    }
  })
  .state('login', {
    url: '/login',
    templateUrl: path.tpl('login'),
    controller: 'LoginCtrl',
    resolve: {
      lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load('loginModule');
      }]
    }
  })
  .state('registration', {
    url: '/registration',
    templateUrl: path.tpl('registration'),
    controller: 'RegistrationCtrl',
    resolve: {
      lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load('regModule');
      }]
    }
  })
  .state('dashboard', {
    url: '/dashboard',
    abstract: true,
    templateUrl: path.tpl('dashboard'),
    controller: 'DashboardCtrl'
  })
  .state('dashboard.express-overhead', {
    url: '/express-overhead',
    templateUrl: path.tpl('express-overhead'),
    controller: 'ExpressOverheadCtrl',
    resolve: {
      lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load('dashboardModule');
      }]
    }
  })
  .state('dashboard.history', {
    url: '/history',
    templateUrl: path.tpl('history'),
    controller: 'HistoryCtrl',
    resolve: {
      lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load('dashboardModule');
      }]
    }
  });

}]);