define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.controller('SidebarController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.sideBarClosed = false;
    $scope.sideBarSearchOpen = false;

    $scope.sidebar = [
      {
        name: 'Home',
        icon: 'home',
        badge: '2',
        open: true,
        active: true,
        child: [
          {
            name: 'home1',
            icon: 'home',
            badge: '1',
            url: '',
            open: false
          },
          {
            name: 'home1',
            icon: 'home',
            badge: '',
            url: '',
            open: false
          },
          {
            name: 'home1',
            icon: 'home',
            badge: '',
            url: '',
            open: false
          }
        ]
      },
      {
        name: 'Home',
        icon: 'home',
        badge: '',
        open: false,
        active: false,
        child: [
          {
            name: 'home1',
            icon: 'home',
            badge: '',
            url: '',
            active: false
          },
          {
            name: 'home1',
            icon: 'home',
            badge: '',
            url: '',
            active: false
          },
          {
            name: 'home1',
            icon: 'home',
            badge: '',
            url: '',
            active: false
          }
        ]
      }
    ];
    $scope.showSidebar = function () {
      $rootScope.sideBarClosed = !$rootScope.sideBarClosed;
    };
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
    $scope.menuParentClick=function(item){
      var open=!item.open;
      $scope.sidebar.forEach(function(sidebarItem){
        sidebarItem.open=false;
      });
      item.open=open;
    };
    $scope.menuChildClick=function(item){
      var active=!item.active;
      $scope.sidebar.forEach(function(sidebarItem){
        sidebarItem.active=false;
        sidebarItem.child.forEach(function(childItem){
          if(childItem==item){
            sidebarItem.active=true;
          }
          childItem.active=false;
        });
      });
      item.active=active;
    };
  }]);
});

