angular.module('myApp.expressOverhead', [])
.controller( 'ExpressOverheadCtrl', ['$scope', '$state', 'NewPost', 'Db', function ($scope, $state, NewPost, Db) {
  // Данные форми

  var d = new Date();
  $scope.minDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
  );

  $scope.expressInvoice = {};
  $scope.expressInvoice._creator = $scope.user._id;
  $scope.expressInvoice.recipient = {};
  $scope.expressInvoice.locations = [{}];

  function getDateTimeString(date) {
    return date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
  }

    $scope.selectCounterparty = function (counterparty) {
        console.log(counterparty);
        if(counterparty){
            $scope.expressInvoice.recipient.FirstName = counterparty.FirstName;
            $scope.expressInvoice.recipient.LastName = counterparty.LastName;
            $scope.expressInvoice.recipient.MiddleName = counterparty.MiddleName;
            $scope.expressInvoice.recipient.Email = counterparty.Email;
            $scope.expressInvoice.recipient.Phone = counterparty.Phones.substr(2);
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


  // сброс форми
  $scope.resetForm = function () {
    $scope.expressInvoice = angular.copy($scope.master);
  };

  function createCounterparty(recipient, success, error) {
    NewPost.query("Counterparty", "save", {
      CityRef: recipient.City.Ref,
      FirstName: recipient.FirstName,
      LastName: recipient.LastName,
      MiddleName: recipient.MiddleName,
      Phone: recipient.Phone,
      Email: recipient.Email,
      CounterpartyType: "PrivatePerson",
      CounterpartyProperty: "Recipient"
    }).then(success, error);
  }

  function createCounterpartyAddress(recipient, success, error) {
    NewPost.query("Address", "save", {
      "CounterpartyRef": $scope.user.Counterparty.Recipient,
      "StreetRef": recipient.Street.Ref,
      "BuildingNumber": recipient.House,
      "Flat": recipient.Flat,
      "Note": "Комментар"
    }).then(success, error);
  }

  $scope.CreateExpressOverhead = CreateExpressOverhead;
  function CreateExpressOverhead(expressInvoice) {
    var httpConfig = {
      method: 'POST',
      url: '/eo/create'
    };

    var InternetDocument = {
      PayerType: expressInvoice.TypeOfPayer.Ref,
      PaymentMethod: "Cash",
      DateTime: getDateTimeString(expressInvoice.DateTime || new Date()),
      CargoType: expressInvoice.CargoType.Ref,
      ServiceType: expressInvoice.ServiceType.Ref,
      Description: expressInvoice.Description,
      Cost: expressInvoice.Cost,
      CitySender: $scope.user.City.Ref,
      Sender: $scope.user.Counterparty.Ref,
      SenderAddress: $scope.user.Address.Ref,
      ContactSender: $scope.user.ContactPerson.Ref,
      SendersPhone: $scope.user.Phone,
      RecipientType: $scope.user.Counterparty.Type,
      Recipient: $scope.user.Counterparty.Recipient
    };

    if(expressInvoice.locations){
      var commonVolume = 0, commonWeight = 0;
      if(expressInvoice.CargoType == 'Documents'){
        commonVolume = 1;
        commonWeight = expressInvoice.locations[0]['weight'];
      } else{
        for(var k in expressInvoice.locations){
          commonVolume += expressInvoice.locations[k]['volumetricVolume'];
          commonWeight += expressInvoice.locations[k]['weight'];
        }
      }
        InternetDocument.SeatsAmount = expressInvoice.locations.length;
      if( $scope.expressInvoice.recipient.Address.Description.indexOf('до 30 кг') !== -1 ){
          console.log(commonVolume, commonWeight, 30);
          InternetDocument.Weight = 29 / InternetDocument.SeatsAmount;
          InternetDocument.VolumeGeneral = 29 / InternetDocument.SeatsAmount;
      } else if($scope.expressInvoice.recipient.Address.Description.indexOf('до 20 кг') !== -1 ){
          console.log(commonVolume, commonWeight,20);
          InternetDocument.Weight = 19 / InternetDocument.SeatsAmount;
          InternetDocument.VolumeGeneral = 19 / InternetDocument.SeatsAmount;
      } else if( $scope.expressInvoice.recipient.Address.Description.indexOf('до 10 кг') !== -1 ){
          console.log(commonVolume, commonWeight, 10);
          InternetDocument.Weight = 9 / InternetDocument.SeatsAmount;
          InternetDocument.VolumeGeneral = 9 / InternetDocument.SeatsAmount;
      }else{
          InternetDocument.Weight = commonWeight;
          InternetDocument.VolumeGeneral = commonVolume;
      }
    }

    if(expressInvoice.TypeOfPayerForRedelivery.Ref){

      InternetDocument.BackwardDeliveryData = [{
          "PayerType": expressInvoice.TypeOfPayerForRedelivery.Ref,
          "CargoType": "Money",
          "RedeliveryString": "4552"
      }]
    }

    if(!expressInvoice.recipient.ContactPerson){
      expressInvoice.recipient.ContactPerson = {};
      createCounterparty(expressInvoice.recipient, function (res) {
        console.log(res);
        expressInvoice.recipient.ContactPerson.Ref = res.data.data[0].ContactPerson.data[0].Ref;
        expressInvoice.recipient.ContactPerson.Description = res.data.data[0].ContactPerson.data[0].Description;
        InternetDocument.ContactRecipient = expressInvoice.recipient.ContactPerson.Ref;
        InternetDocument.CityRecipient = expressInvoice.recipient.City.Ref;
        InternetDocument.RecipientsPhone = expressInvoice.recipient.Phone;

        if(!expressInvoice.recipient.Address) {
          expressInvoice.recipient.Address = {};
          createCounterpartyAddress(expressInvoice.recipient, function (res) {
            console.log(res);
            $scope.expressInvoice.recipient.Address = res.data.data[0];
            expressInvoice.recipient.Address.Ref = res.data.data[0].Ref;
            InternetDocument.RecipientAddress = expressInvoice.recipient.Address.Ref;
            NewPost.query("InternetDocument", "save", InternetDocument).then(function (res) {
              console.log(res, 'save InternetDocument');
              $scope.expressInvoice.Ref = res.data.data[0].Ref;
              $scope.expressInvoice.CostOnSite = res.data.data[0].CostOnSite;
              $scope.expressInvoice.EstimatedDeliveryDate = res.data.data[0].EstimatedDeliveryDate;
              $scope.expressInvoice.IntDocNumber = res.data.data[0].IntDocNumber;
              $scope.expressInvoice.TypeDocument = res.data.data[0].TypeDocument;
              httpConfig.data = $scope.expressInvoice;
              Db.query(httpConfig).then(function (res) {
                console.log(res);
                  if(res.status == 201) {
                      $state.go('dashboard.history');
                      $scope.selectedNavItem = 'dashboard.history';
                  }
              },function (err) {
                console.log(err);
              });
            }, function (err) {
              console.log(err);
            });
          }, function (err) {

          })
        } else {
          InternetDocument.RecipientAddress = $scope.expressInvoice.recipient.Address.Ref;
          NewPost.query("InternetDocument", "save", InternetDocument).then(function (res) {
            console.log(res, 'save InternetDocument');
            $scope.expressInvoice.Ref = res.data.data[0].Ref;
            $scope.expressInvoice.CostOnSite = res.data.data[0].CostOnSite;
            $scope.expressInvoice.EstimatedDeliveryDate = res.data.data[0].EstimatedDeliveryDate;
            $scope.expressInvoice.IntDocNumber = res.data.data[0].IntDocNumber;
            $scope.expressInvoice.TypeDocument = res.data.data[0].TypeDocument;
            httpConfig.data = $scope.expressInvoice;
            if(res.data.success){
                Db.query(httpConfig).then(function (res) {
                    console.log(res);
                    if(res.status == 201) {
                        $state.go('dashboard.history');
                        $scope.selectedNavItem = 'dashboard.history';
                    }
                },function (err) {
                    console.log(err);
                });
            }
          }, function (err) {
            console.log(err);
          });
        }

      }, function (err) {
        console.log(err);
      });

    } else {
      InternetDocument.CityRecipient = expressInvoice.recipient.City.Ref;
      InternetDocument.ContactRecipient = expressInvoice.recipient.ContactPerson.Ref;
      InternetDocument.RecipientsPhone = expressInvoice.recipient.Phone;
      if( !expressInvoice.recipient.Address ) {
        $scope.expressInvoice.recipient.Address = {};
        createCounterpartyAddress(expressInvoice.recipient, function (res) {
          $scope.expressInvoice.recipient.Address = res.data.data[0];
          InternetDocument.RecipientAddress = $scope.expressInvoice.recipient.Address.Ref;
          NewPost.query("InternetDocument", "save", InternetDocument).then(function (res) {
            console.log(res, 'save InternetDocument');
            $scope.expressInvoice.Ref = res.data.data[0].Ref;
            $scope.expressInvoice.CostOnSite = res.data.data[0].CostOnSite;
            $scope.expressInvoice.EstimatedDeliveryDate = res.data.data[0].EstimatedDeliveryDate;
            $scope.expressInvoice.IntDocNumber = res.data.data[0].IntDocNumber;
            $scope.expressInvoice.TypeDocument = res.data.data[0].TypeDocument;
            httpConfig.data = $scope.expressInvoice;
            if(res.data.success){
                Db.query(httpConfig).then(function (res) {
                    console.log(res);
                    if(res.status == 201) {
                        $state.go('dashboard.history');
                        $scope.selectedNavItem = 'dashboard.history';
                    }
                },function (err) {
                    console.log(err);
                });
            }
          }, function (err) {
            console.log(err);
          });
        });

      } else {
          InternetDocument.RecipientAddress = expressInvoice.recipient.Address.Ref;
          console.log(InternetDocument);
          NewPost.query("InternetDocument", "save", InternetDocument).then(function (res) {
            console.log(res, 'save InternetDocument');
            $scope.expressInvoice.Ref = res.data.data[0].Ref;
            $scope.expressInvoice.CostOnSite = res.data.data[0].CostOnSite;
            $scope.expressInvoice.EstimatedDeliveryDate = res.data.data[0].EstimatedDeliveryDate;
            $scope.expressInvoice.IntDocNumber = res.data.data[0].IntDocNumber;
            $scope.expressInvoice.TypeDocument = res.data.data[0].TypeDocument;
            httpConfig.data = $scope.expressInvoice;
            if(res.data.success){
                Db.query(httpConfig).then(function (res) {
                    console.log(res);
                    if(res.status == 201) {
                        $state.go('dashboard.history');
                        $scope.selectedNavItem = 'dashboard.history';
                    }

                },function (err) {
                    console.log(err);
                });
            }
          }, function (err) {
              console.log(err);
          });
      }

    }

  }

}]);