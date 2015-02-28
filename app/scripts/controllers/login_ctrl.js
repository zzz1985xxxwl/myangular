define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.controller('LoginController', ['$scope', function ($scope) {
    $scope.data = {
      name: '',
      password: '',
      remember: false
    };
    $scope.login = function () {
      if ($scope.loginForm.$valid) {
        location.href = '/';
      }
    };
  }]);
});

