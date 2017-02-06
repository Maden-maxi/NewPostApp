angular.module("myApp.registration", ["ui.router"])
.controller( "RegistrationCtrl", ["$scope", "$state","NewPost", "Db", function ($scope, $state, NewPost, Db) {

    NewPost.getCities().then(function (res) {
        $scope.cities = res;
    }, function (err) {
        console.log(err);
    });

  $scope.address = {};

  $scope.user = {};
  $scope.user.Counterparty = {};
  $scope.user.Counterparty.Property = "Sender";

    //75a6261a-d81d-11e6-8ba8-005056881c6b - Sender
    //75acfa37-d81d-11e6-8ba8-005056881c6b - Recipient

    //75aa91f6-d81d-11e6-8ba8-005056881c6b - contactRef


    // Получаем идентификатор Отправителя
    NewPost.query('Counterparty', 'getCounterparties', {
        "CounterpartyProperty": $scope.user.Counterparty.Property,
        "Page": "1"
    }).then(function (res) {
        console.log(res);
        $scope.user.Counterparty.Ref = res.data.data[0].Ref;
        $scope.user.Counterparty.Type = res.data.data[0].CounterpartyType;
        NewPost.query('Counterparty', 'getCounterpartyContactPersons', {
            "Ref":  $scope.user.Counterparty.Ref,
            "Page": "1"
        }).then(function (res) {
            console.log(res);
            $scope.user.ContactPerson = {};
            $scope.user.ContactPerson.Ref = res.data.data[0].Ref;
            $scope.user.ContactPerson.Description = res.data.data[0].Description;
        }, function (err) {
            console.log(err);
        });
    }, function (err) {
        console.log(err);
    });

    // Получаем идентификатор Получателя (Ref)
    NewPost.query('Counterparty', 'getCounterparties', {
        "CounterpartyProperty": "Recipient",
        "Page": "1"
    }).then(function (res) {
        $scope.user.Counterparty.Recipient = res.data.data[0].Ref;
    }, function (err) {
        console.log(err);
    });

    $scope.getStreets = function (city) {

        if(angular.isDefined(city)){
            console.log(city, 'cityRef');

            $scope.user.City = {
                Ref: city.Ref,
                Description: city.Description
            };

            NewPost.getStreets(city.Ref).then(function (res) {
                $scope.streets = res;
            }, function (err) {
                console.log(err);
            });

            NewPost.getWarehouses(city.Ref).then(function (res) {
                $scope.warehouses = res;
            }, function (err) {
                console.log(err);
            });

        }
    };

    $scope.searchStreetChange = function(street){
        console.log(street);
        $scope.user.Street = {
            Ref: street.Ref,
            Description: street.Description
        };
    };

    $scope.logWarehouse = function (warehouse) {
        console.log(warehouse);
        $scope.user.Address = {
            Ref: warehouse.Ref,
            Description: warehouse.Description
        };
    };


  //Проверка пароля
  $scope.equalPasswords = function () {
    return $scope.user.password === $scope.passwordConfirm;
  };
  //Сброс формы
  $scope.resetForm = function () {
    $scope.user = angular.copy($scope.master);
  };

  $scope.register = function (user){

    if( $scope.typeAddr == 'Отделение' ){
        Db.query({
            method: 'POST',
            url: '/user/create',
            data: user
        }).then(function (res) {
            $state.go('login');
        }, function (err) {
            console.log(err);
            if(err.status == 400) {
                if (err.data.errmsg.indexOf('Email') !== -1) {
                    $scope.errorNotify = 'Пользователь с таким Email уже существует';
                }
                if (err.data.errmsg.indexOf('Phone') !== -1) {
                    $scope.errorNotify = 'Пользователь с таким телефоном уже существует';
                }
            }
        });
    } else {
        console.log(user);
        NewPost.query("Address", "save", {
            "CounterpartyRef": user.Counterparty.Recipient,
            "StreetRef": user.Street.Ref,
            "BuildingNumber": user.House || "",
            "Flat": user.Flat || "",
            "Note": "Комментар"
        }).then(function (res) {
            user.Address = res.data.data[0];

            Db.query({
                method: 'POST',
                url: '/user/create',
                data: user
            }).then(function (response) {
                $state.go('login');
            }, function (err) {
                console.log(err);
                if(err.status == 400) {
                    if (err.data.errmsg.indexOf('Email') !== -1) {
                        $scope.errorNotify = 'Пользователь с таким Email уже существует';
                    }
                    if (err.data.errmsg.indexOf('Phone') !== -1) {
                        $scope.errorNotify = 'Пользователь с таким телефоном уже существует';
                    }
                }
            });
        }, function (err) {
            console.log(err);
        });
    }

  };

}]);