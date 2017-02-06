angular.module('myApp.dashboard', [])
.controller( 'DashboardCtrl', ['$scope', '$cookies', '$rootScope', 'Auth', 'NewPost', '$state', function ($scope, $cookies, $rootScope, Auth, NewPost, $state) {
  $scope.contactImage = 'img/user-icon-placeholder.png';
  $scope.selectedNavItem = $state.current.url.substr(1);

  $scope.user = JSON.parse( localStorage.getItem('user') );

  console.log($scope.user);

  $scope.logout = function(){
    Auth.ClearCredentials();
  };

  $scope.locationsCbrt = function (w,h,l) {
    return Math.cbrt(w*h*l);
  };

  $scope.directory = {
    serviceTypes: [
      {
        "Description":"Склад-Склад",
        "Ref":"WarehouseWarehouse"
      },
      {
        "Description":"Склад-Двері",
        "Ref":"WarehouseDoors"
      }
    ],
    cargoTypes: [
      {
        "Description":"Вантаж",
        "Ref":"Cargo"
      },
      {
        "Description":"Документи",
        "Ref":"Documents"
      }
    ]
  };

  //Получение списка контрагентов
  NewPost.query("Counterparty", "getCounterpartyContactPersons", {
    "Ref": $scope.user.Counterparty.Recipient /*|| "75acfa37-d81d-11e6-8ba8-005056881c6b"*/,
    "Page": "1"
  }).then(function (res) {
    console.log(res);
    $scope.directory.counterparties = res.data.data;
  }, function (err) {
    console.log(err);
  });


  // Получение списка городов
  NewPost.getCities().then(function (res) {
    $scope.directory.cities = res;
  }, function (err) {
    console.log(err);
  });

  // Получение типов плательщиков
  NewPost.query('Common', 'getTypesOfPayers').then(function (res) {
    var types = res.data.data;
    types.pop();
    $scope.directory.typesOfPayers = types;
  }, function (err) {
    console.log(err);
  });

  // Получение типов плательщиков обратной доставки
  NewPost.query('Common', 'getTypesOfPayersForRedelivery').then(function (res) {
    $scope.directory.typesOfPayersForRedelivery = res.data.data;
  }, function (err) {

  });

}]);