define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.directive('dlHoverClick', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var $element = $(element), hovered = false;
        $element.on('mouseenter', function () {
          if (!hovered) {
            $element.trigger('click');
          }
          hovered = true;
        });
        $element.on('mouseleave', function () {
          hovered = false;
        });
        scope.$on('$destroy', function () {
          $element.off('mouseenter');
          $element.off('mouseleave');
          $element = null;
        });
      }
    };
  });
});
