define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.directive('dlGrid', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        $(element).Grid(scope.gridConfig);
      }
    };
  });
});
