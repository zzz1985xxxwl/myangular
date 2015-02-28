define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.directive('dlGrid', function ($compile, $http, $templateCache, $window, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var $element = $(element),
          grid = scope[attrs.dlGrid],
          onSuccess = grid.onSuccess;

        function getTemplatePromise(templateUrl) {
          return $http.get(templateUrl,
            {cache: $templateCache}).then(function (result) {
              return result.data;
            });
        }

        scope.$on('dl.sideBarShowClose', function () {
          $element.Grid('calcAndInitHideScrollWidth');
        });

        $($window).on('resize', (function () {
          var timeoutPromise;
          function changeGridWidth(){
            $timeout.cancel(timeoutPromise);
            timeoutPromise=$timeout(function(){$element.Grid('calcAndInitHideScrollWidth');},100);
          }
          return changeGridWidth;
        })());

        getTemplatePromise('/views/order/bulkmenu.html').then(function (bulkMenu) {
          //config
          grid.bulkMenuHtml = bulkMenu;
          grid.onSuccess = function () {
            if (onSuccess) {
              onSuccess();
            }
            $compile($element)(scope);
          };
          $element.Grid(grid);
        }).then(function () {
          grid.getElement = function () {
            return $element;
          };
          grid.load = function (pageIndex) {
            $element.Grid('load', pageIndex);
          };
          grid.getData = function () {
            $element.Grid('getData');
          };
          grid.getSelectedItem = function () {
            $element.Grid('getSelectedItem');
          };
        });
      }
    };
  })
    .directive('dlHoverClick', function () {
      return {
        restrict: 'A',
        link: function (scope, element) {
          var $element = $(element),hovered=false;
          $element.on('mouseover.hoverClick', function () {
            if(!hovered) {
              $element.trigger('click');
            }
            hovered=true;
          });
          $element.on('mouseleave.hoverClick', function () {
            hovered=false;
          });
        }
      }
    });
});
