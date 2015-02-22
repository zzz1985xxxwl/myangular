'use strict';
define(['angularAMD',
  'angular-route',
  'angular-animate',
  'angular-cookies',
  'plugins/grid',
  'plugins/notify',
  'controllers/sidebar_ctrl',
  'controllers/login_ctrl',
  'directives/pageContentHeight',
  'directives/plugins',
  'directives/validation',
  'animation/slideDown',
  'angular-resource',
  'angular-bootstrap',
  'angular-bootstrap-show-errors'], function (angularAMD) {
  var app = angular.module('dl-app', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngResource', 'ui.bootstrap', 'ui.bootstrap.showErrors']);

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/home', angularAMD.route({
        templateUrl: 'views/home.html', controllerUrl: 'controllers/home_ctrl', nav: 'home'
      })).when('/table', angularAMD.route({
        templateUrl: 'views/table.html', controllerUrl: 'controllers/table_ctrl', nav: 'table'
      }))
      .otherwise({redirectTo: '/home'});
  });

  // Define constant
  app.constant('SiteName', '/angularAMD');

  // Bootstrap Angular when DOM is ready
  return angularAMD.bootstrap(app);

});
