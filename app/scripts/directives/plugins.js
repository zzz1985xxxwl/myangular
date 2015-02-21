define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.directive('dlGrid', function ($compile) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var $element = $(element),
          grid = scope[attrs.dlGrid],
          onSuccess = grid.onSuccess;

        grid.onSuccess = function () {
          if (onSuccess)onSuccess();
          $compile($element)(scope);
        };
        $element.Grid(grid);
        grid.getElement = function () {
          return $element;
        };
        grid.load = function (pageIndex) {
          $element.Grid("load", pageIndex);
        };
        grid.getData = function () {
          $element.Grid("getData");
        };
      }
    };
  });
});
