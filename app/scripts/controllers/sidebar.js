'use strict';
define(['./module'], function (module) {
  module.controller('SidebarController', ['$scope', '$rootScope','Book',function ($scope,$rootScope) {
    $rootScope.sideBarClosed=false;
    $scope.showSidebar = function(){
      $rootScope.sideBarClosed=!$rootScope.sideBarClosed;
    };
  }]);
});

