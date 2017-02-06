app.controller('AppCtrl', ['$scope', '$rootScope', '$cookies', '$state', function ($scope, $rootScope, $cookies, $state) {
  $rootScope.NEW_POST_API_FORMAT = 'json';
  $rootScope.NEW_POST_API_KEY = '58a43ec2dfb8cb29378dd0f0bc635080';
  $scope.appname = 'Nova Poshta';
  $scope.date = new Date();
  $scope.dateMin = Date.now();


  $scope.errorMessages = {
    required: "Поле обов'язкове",
    len: {
      name: "Поле має бути не меньше 2 и не більше 50 букв не мати цифр та пробелів",
      email: "Довжина емайлу неповина будти меньшою ніж 10 символів и небільшою ніж 50 символів"
    },
    namePattern: "Поле не повинно мати цифр та пробелів та починатись з великої букви і немати букв з російського алфавіту",
    emailPattern: "Невірний формат емайла. Приклад як потрибно: test@mail.com"
  };
  $scope.validate = {
    name: "^[ЙЦУКЕНГШЩЗХЇФІВАПРОЛДЖЄЯЧСМИТЬБЮ]{1}[\'\`йцукенгшщзхїфівапролджєячсмитьбю]+$",
    email: "^.+@.+\..+$"
  };

}]);