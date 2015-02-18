define(['angularAMD', 'angular-animate'], function (angularAMD) {
  'use strict';
  angularAMD.directive('pageContentHeight', function () {
    return {
      restrict: 'C',
      link: function (scope, element) {
        var heightByWindow=$(window).height() - 79,min=700;
        $(element).css('min-height', heightByWindow>min?heightByWindow:min);
      }
    };
  });
});
