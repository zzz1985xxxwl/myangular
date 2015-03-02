define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.directive('sidebarClosedToggle', function (storage, $timeout,$rootScope) {
    return {
      restrict: 'EAC',
      link: function (scope, element) {
        var $body = $('body'),
          key = 'sidebarClosedToggle',
          theClass = 'page-sidebar-closed',
          state = storage.get(key);
        $body.addClass(state);
        element.on('click', function () {
          if ($body.hasClass(theClass)) {
            $body.removeClass(theClass);
            storage.remove(key)
          } else {
            $body.addClass(theClass);
            storage.set(key, theClass);
          }
          $timeout(function () {
            $rootScope.$broadcast('dl.sideBarShowClose', $body.hasClass(theClass));
          }, 50);
        });
      }
    }
  })
});
