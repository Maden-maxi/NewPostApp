angular.module('myApp.history', [])
.controller( 'HistoryCtrl', ['$scope',  'NewPost', 'Db', '$mdDialog', function ($scope, NewPost, Db, $mdDialog) {
    $scope.search = {};
    $scope.search.CitySender = $scope.user.City.Ref;
    $scope.search.SenderAddress = $scope.user.Address.Ref;

    $scope.printStatuses = [
        {code: undefined, desc: "Всі"},
        {code: "0", desc: "Не роздруковані"},
        {code: "1", desc: "Роздруковані"}
    ];

    console.log($scope.user);
    $scope.titles = ['Номер ТТН', 'Дата Відправки', 'Вартість перевозки', 'Данні покупця', 'Дата створення', 'Дата друкування'];


    $scope.minDate = new Date($scope.user.created);

    $scope.fromDate = $scope.minDate;
    $scope.toDate = new Date( $scope.minDate.getFullYear()+1 ,11,1);

    function getDocList(options) {
        options = !options ? {} : options;
        NewPost.query("InternetDocument", "getDocumentList", {
            "GetFullList": "0",
            "Page": options.page || undefined,
            "DateTimeFrom": options.dateTimeFrom || getDateTimeString($scope.minDate),
            "DateTimeTo": options.dateTimeTo || "31.12.2100"
        }).then(function (res) {
            console.log(res);
            $scope.eoList = res.data.data;
        }, function (err) {
            console.log(err);
        });
    }
    getDocList();

    function getDateTimeString(date) {
        return date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
    }

    $scope.setDateTimeFrom = function (date) {
        var params = {
            dateTimeFrom: getDateTimeString(date),
            dateTimeTo: getDateTimeString($scope.toDate)
        };
        console.log(params);
        getDocList(params);
    };

    $scope.setDateTimeTo = function (date) {
        var params = {
            dateTimeFrom: getDateTimeString($scope.fromDate),
            dateTimeTo: getDateTimeString(date)
        };
        console.log(params);
        getDocList(params);
    };


    $scope.updateExpressInvoice = function (ev, expressInvoice, user) {

            $mdDialog.show({
                resolve: {
                    lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('main/controllers/UpdateExpressOverheadCtrl.js');
                    }]
                },
                templateUrl: 'main/templates/update-express-overhead.tpl.html',
                controller: 'UpdateExpressOverheadCtrl',
                bindToController: true,
                locals: {
                    expressInvoice: expressInvoice,
                    user: user
                },
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen:  true// Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                    getDocList();
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });

    };

    $scope.deleteExpressInvoice = function(ev, ref){

        var confirm = $mdDialog.confirm()
            .title('Ви дійсно хочете видалити експресс-накладну?')
            .textContent('Після підтвердження експресс-накладна буде видалена з вашого списку експресс накладних!')
            .ariaLabel('Delete Express Invoice')
            .targetEvent(ev)
            .ok('Так видалити!')
            .cancel('Ні я передумав!');

        $mdDialog.show(confirm).then(function() {
            NewPost.query("InternetDocument", "delete", {
                "DocumentRefs": ref
            }).then(function (res) {
                console.log(res);

                if(res.data.success) {

                    Db.query({
                        method: 'DELETE',
                        url: '/eo/'+ref
                    }).then(function (res) {
                        console.log(res);
                    }, function (err) {
                        console.log(err);
                    });

                    getDocList({
                        dateTimeFrom: getDateTimeString($scope.fromDate),
                        dateTimeTo: getDateTimeString($scope.toDate)
                    });
                }


            }, function (err) {
                console.log(err);
            });

        }, function() {
            console.log(ev, ref);
        });

    };

    $scope.printDoc = function (ev, options) {
        options = !options ? {} : options;
        var target = options.docType ? 'маркування' : 'експресс-накладн';

        var confirm = $mdDialog.confirm()
            .title('Ви дійсно хочете роздрукувати ' + target + 'у?')
            .textContent('Після підтвердження ' + target + 'а буде мати статус роздруковано!')
            .ariaLabel('Print Express Invoice')
            .targetEvent(ev)
            .ok('Так роздрукувати!')
            .cancel('Ні я передумав!');

        $mdDialog.show(confirm).then(function() {
            NewPost.printDocument(options.ref, options.printType, function (res) {
                console.log(res, success);
                options.status = "1";
                getDocList({
                    dateTimeFrom: getDateTimeString($scope.fromDate),
                    dateTimeTo: getDateTimeString($scope.toDate)
                });
            }, function (err) {
                console.log(err, 'error');
                options.status = "1";
                getDocList({
                    dateTimeFrom: getDateTimeString($scope.fromDate),
                    dateTimeTo: getDateTimeString($scope.toDate)
                });
            });
        }, function() {
                console.log(ev, options);
        });

    };


}]);