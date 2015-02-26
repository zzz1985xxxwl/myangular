define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.directive('dlGrid', function ($compile, $http, $templateCache) {
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

        function getTemplatePromise(templateUrl) {
          return $http.get(templateUrl,
            {cache: $templateCache}).then(function (result) {
              return result.data;
            });
        }

        getTemplatePromise('/views/edit.html').then(function (d) {
          console.log(d)
        });
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
