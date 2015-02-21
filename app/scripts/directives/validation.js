define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.directive('integer', function () {
    return {
      restrict: 'AC',
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.integer = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          }
          if (/^\-?\d+$/.test(viewValue)) {
            return true;
          }
          return false;
        };
      }
    };
  }).directive('decimal', function () {
    return {
      restrict: 'AC',
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.integer = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          }
          if (/^\d+[.]?\d*$/.test(viewValue)) {
            return true;
          }
          return false;
        };
      }
    };
  });
});
