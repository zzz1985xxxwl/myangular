define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.controller('SidebarController', function ($scope, $rootScope, $route) {
    $scope.sidebar = [
      {
        name: '首页',
        icon: 'home',
        badge: '2',
        open: true,
        active: true,
        child: [
          {name: '首页', icon: 'home', badge: '1', url: 'home', active: true},
          {name: '表格', icon: 'home', badge: '1', url: 'table', active: false},
          {name: 'home1', icon: 'home', badge: '', url: '', active: false}
        ]
      },
      {
        name: 'Home',
        icon: 'home',
        badge: '',
        open: false,
        active: false,
        child: [
          {name: 'home1', icon: 'home', badge: '', url: '', active: false},
          {name: 'home1', icon: 'home', badge: '', url: '', active: false},
          {name: 'home1', icon: 'home', badge: '', url: '', active: false},
          {name: 'home1', icon: 'home', badge: '', url: '', active: false},
          {name: 'home1', icon: 'home', badge: '', url: '', active: false},
          {name: 'home1', icon: 'home', badge: '', url: '', active: false},
          {name: 'home1', icon: 'home', badge: '', url: '', active: false},
          {name: 'home1', icon: 'home', badge: '', url: '', active: false}
        ]
      }
    ];
    $scope.sidebar.forEach(function (sidebarItem) {
      sidebarItem.child.forEach(function (item) {
        item.active = item.url === $route.current.nav;
      });
    });

    $scope.showSearch = function () {
      if ($rootScope.sideBarClosed) {
        $scope.sideBarSearchOpen = true;
      }
    };
    $scope.closeSearch = function () {
      if ($rootScope.sideBarClosed) {
        $scope.sideBarSearchOpen = false;
      }
    };
    $scope.menuParentClick = function (item) {
      var open = !item.open;
      $scope.sidebar.forEach(function (sidebarItem) {
        sidebarItem.open = false;
      });
      item.open = open;
    };
    $scope.menuChildClick = function (item) {
      var active = !item.active;
      $scope.sidebar.forEach(function (sidebarItem) {
        sidebarItem.active = false;
        sidebarItem.child.forEach(function (childItem) {
          if (childItem === item) {
            sidebarItem.active = true;
          }
          childItem.active = false;
        });
      });
      item.active = active;
    };
  }).directive('sideBar', function () {
    return {
      restrict: 'A',
      controller: 'SidebarController',
      templateUrl: 'views/sidebar.html'
    };
  });

});

