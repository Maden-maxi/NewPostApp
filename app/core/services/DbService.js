angular.module('db', [])
.factory( 'Db', ['$http', '$q', function ($http, $q) {
  var self = this;

  self.query = function (config) {
    var defer = $q.defer();
    
    $http(config).then(function (res) {
      defer.resolve(res);
    }, function (err) {
      defer.reject(err);
    });

    return defer.promise;
  };

  return self;
}]);