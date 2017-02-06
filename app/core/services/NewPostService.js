angular.module('newPost', [])
.factory( 'NewPost', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

  var API = 'https://api.novaposhta.ua/v2.0/' + ( $rootScope.NEW_POST_API_FORMAT || 'json' ) + '/' ;
  var API_KEY = $rootScope.NEW_POST_API_KEY || '';
  var self = this;

  /**
   *
   * @param {String} model
   * @param {String} method
   * @param {Object} [props]
   * @returns {Function}
   */
  self.query = function (model, method, props) {
    var defer = $q.defer(),
      reqParams = {
        "apiKey": API_KEY,
        "modelName": model,
        "calledMethod": method,
        "methodProperties": props || {}
      };

    $http.post(API, reqParams).then(function (res) {
      defer.resolve(res);
    }, function (err) {
      defer.reject(err);
    });

    return defer.promise;
  };

  self.typesOfCounterparties = {};
  self.getTypesOfCounterparties = function () {
    var defer = $q.defer();
    var reqParams = {
      "modelName": "Common",
      "calledMethod": "getTypesOfCounterparties",
      "apiKey": API_KEY,
      "methodProperties": {}
    };

    $http.post(API, reqParams).then(function (res) {
      self.typesOfCounterparties = res.data;
      defer.resolve(res);
    }, function (err) {
      console.log(err);
      defer.reject(err);
    });

    self.typesOfPayers = {};
    self.getTypesOfPayers = function () {
      var defer = $q.defer();
      var reqParams = {
        "modelName": "Common",
        "calledMethod": "getTypesOfPayers",
        "apiKey": API_KEY,
        "methodProperties": {}
      };

      $http.post(API, reqParams).then(function (res) {
        self.typesOfPayers = res.data;
        defer.resolve(res);
      }, function (err) {
        console.log(err);
        defer.reject(err);
      });

      return defer.promise;
    };

    return defer.promise;
  };


  self.getCities = function () {
    var defer = $q.defer();
    var reqParams = {
      "modelName": "Address",
      "calledMethod": "getCities",
      "apiKey": API_KEY,
      "methodProperties": {}
    };
    $http.post(API, reqParams).then(function (res) {
      defer.resolve(res.data.data);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  };

  self.getWarehouses = function (cityRef) {
    var defer = $q.defer();
    var reqParams = {
      "modelName": "Address",
      "calledMethod": "getWarehouses",
      "apiKey": API_KEY,
      "methodProperties": {
        "CityRef": cityRef,
        "PostFinance": "1"
      }
    };
    $http.post(API, reqParams).then(function (res) {
      defer.resolve(res.data.data);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  };

  self.getStreets = function (cityRef) {
    var defer = $q.defer();
    var reqParams = {
      "modelName": "Address",
      "calledMethod": "getStreet",
      "apiKey": API_KEY,
      "methodProperties": {
        "CityRef": cityRef
      }
    };
    $http.post(API, reqParams).then(function (res) {
      defer.resolve(res.data.data);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  };

  self.getServiceTypes = function () {
    var defer = $q.defer();
    var reqParams = {
      "modelName": "Common",
      "calledMethod": "getServiceTypes",
      "apiKey": API_KEY,
      "methodProperties": {}
    };
    $http.post(API, reqParams).then(function (res) {
      defer.resolve(res.data);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  };

  function printQuery(ref, type) {
    return 'https://my.novaposhta.ua/orders/printMarkings/orders[]/' + ref + '/type/' + (type || 'pdf' ) + '/apiKey/'+API_KEY;
  }

  self.printDocument = function(ref, type, success, error){
    var config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Host': 'my.novaposhta.ua',
        'Origin': 'https://my.novaposhta.ua'
      }
    };
    $http.get( printQuery(ref, type) ).then(success,error);
  };

  return self;
}]);