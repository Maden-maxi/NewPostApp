angular.module('myApp.history')
    .controller('UpdateExpressOverheadCtrl', ['$scope', '$mdDialog','NewPost', 'expressInvoice', 'user', 'Db', function ($scope, $mdDialog, NewPost, expressInvoice, user, Db) {

        $scope.user = JSON.parse( localStorage.getItem('user') );
        $scope.contactImage = 'img/user-icon-placeholder.png';

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
            "Ref": $scope.user.Counterparty.Recipient,
            "Page": "1"
        }).then(function (res) {
            //console.log(res);
            $scope.directory.counterparties = res.data.data;
        }, function (err) {
            //console.log(err);
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

        $scope.expressInvoice = {};

        Db.query({
          method: 'GET',
          url: '/eo/'+expressInvoice.IntDocNumber
        }).then(function (res) {
            console.log(res.data.locations);
            var data = res.data;
            delete data._creator;
            delete data.created;
            delete data.__v;
            console.log(data, 'from db');
            $scope.expressInvoice = data;

            $scope.expressInvoice.DateTime = new Date( data.DateTime );
            $scope.selectCounterparty = function (counterparty) {
                console.log(counterparty);
                if(counterparty){
                    $scope.expressInvoice.recipient.FirstName = counterparty.FirstName;
                    $scope.expressInvoice.recipient.LastName = counterparty.LastName;
                    $scope.expressInvoice.recipient.MiddleName = counterparty.MiddleName;
                    $scope.expressInvoice.recipient.Email = counterparty.Email;
                    $scope.expressInvoice.recipient.Phone = counterparty.Phones;
                    $scope.expressInvoice.recipient.ContactPerson = {
                        Ref: counterparty.Ref,
                        Description: counterparty.Description
                    };
                } else {
                    $scope.expressInvoice.recipient.FirstName = null;
                    $scope.expressInvoice.recipient.LastName = null;
                    $scope.expressInvoice.recipient.MiddleName = null;
                    $scope.expressInvoice.recipient.Email = null;
                    $scope.expressInvoice.recipient.Phone = null;
                    $scope.expressInvoice.recipient.ContactPerson = undefined;
                }
            };

            $scope.searchCity = data.recipient.City.Description;
            if(data.recipient.Street){
                $scope.searchStreet = data.recipient.Street.Description;
            }

            NewPost.getWarehouses(data.recipient.City.Ref).then(function (res) {
                $scope.warehouses = res;
            }, function (err) {
                console.log(err);
            });
            NewPost.getStreets(data.recipient.City.Ref).then(function (res) {
                $scope.streets = res;
            }, function (err) {
                console.log(err);
            });

        }, function (err) {
            console.error(err);
        });



        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.getStreets = function (city) {

            if(angular.isDefined(city)){

                $scope.expressInvoice.recipient.City = {
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

        $scope.searchStreetChange = function (street) {
            $scope.expressInvoice.recipient.Street = {
                Ref: street.Ref,
                Description: street.Description
            };
        };

        $scope.setRecipientAddress = function (warehouse) {
            $scope.expressInvoice.recipient.Address = {
                Ref: warehouse.Ref,
                Description: warehouse.Description
            };
        };

        console.log(expressInvoice, 'in dialog');

        function getDateTimeString(date) {
            return date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
        }

        $scope.answer = function(answer) {
            if(answer.locations){
                var commonVolume = 0, commonWeight = 0;
                if(answer.CargoType == 'Documents'){
                    commonVolume = 1;
                    commonWeight = answer.locations[0]['weight'];
                } else{
                    for(var k in answer.locations){
                        commonVolume += answer.locations[k]['volumetricVolume'];
                        commonWeight += answer.locations[k]['weight'];
                    }
                }
                answer.VolumeGeneral = Math.ceil(commonVolume);
                answer.Weight = Math.ceil(commonWeight);
                answer.SeatsAmount = Math.ceil(answer.locations.length);
            }
            var updatedData = {
                Ref: expressInvoice.Ref,
                PayerType: answer.TypeOfPayer.Ref,
                PaymentMethod: "Cash",
                DateTime: getDateTimeString(answer.DateTime || new Date()),
                CargoType: answer.CargoType.Ref,
                ServiceType: answer.ServiceType.Ref,
                Description: answer.Description,
                Cost: answer.Cost,
                VolumeGeneral: answer.VolumeGeneral,
                Weight: answer.Weight,
                SeatsAmount: answer.SeatsAmount,
                CitySender: expressInvoice.CitySender,
                Sender: expressInvoice.Sender,
                SenderAddress: expressInvoice.SenderAddress,
                ContactSender: expressInvoice.ContactSender,
                SendersPhone: user.Phone,
                CityRecipient: answer.recipient.City.Ref || expressInvoice.CityRecipient,
                Recipient: answer.Recipient || expressInvoice.Recipient,
                RecipientAddress: answer.recipient.Address.Ref || expressInvoice.RecipientAddress,
                ContactRecipient: answer.recipient.ContactPerson.Ref || expressInvoice.ContactRecipient,
                RecipientsPhone: answer.recipient.Phone || expressInvoice.RecipientContactPhone
            };

            NewPost.query("InternetDocument", "update", updatedData)
                .then(function (res) {
                    if(!res.data.errors.length){
                        $scope.expressInvoice.IntDocNumber = res.data.data[0].IntDocNumber;
                        $scope.expressInvoice.Ref = res.data.data[0].Ref;
                        $scope.expressInvoice.EstimatedDeliveryDate = res.data.data[0].EstimatedDeliveryDate;
                        $scope.expressInvoice.CostOnSite = res.data.data[0].CostOnSite;
                        Db.query({
                            method: 'PUT',
                            url: '/eo/'+ expressInvoice.IntDocNumber,
                            data: $scope.expressInvoice
                        }).then(function (res) {
                            if(res.status == 200){
                                $mdDialog.hide(updatedData);
                            }
                            console.log(res);
                        }, function (err) {
                            console.log(err);
                        });

                    }

                   console.log(res);
                }, function (err) {
                    console.log(err);
                });

        };
    }]);
