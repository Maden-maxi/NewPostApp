angular.module('myApp.login', [])
.controller( 'LoginCtrl', ['$scope', '$state', 'Auth', function ($scope, $state, Auth) {

  $scope.credentials = {};

  $scope.login = function (credentials) {
    $scope.dataLoading = true;
    Auth.ClearCredentials();
    Auth.Login(credentials, function (response) {

      Auth.SetCredentials(response.data.cookie, response.data.user);
      $state.go('dashboard.express-overhead');
      console.log(response, 'response');
    }, function (error) {
      if(error.status == 401){
        $scope.wrongCredentials = true;
      }
      console.log(error, 'error');
    });
  };

}]);