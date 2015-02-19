'use strict';
define(['angularAMD',
  'angular-route',
  'angular-animate',
  'angular-cookies',
  'plugins/grid',
  'plugins/notify',
  'controllers/sidebar_ctrl',
  'directives/pageContentHeight',
  'directives/plugins',
  'animation/slideDown',
  'angular-resource',
  'bootstrap'], function (angularAMD) {
  var app = angular.module('dl-app', ['ngRoute','ngAnimate','ngCookies','ngResource']);

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/home', angularAMD.route({
        templateUrl: 'views/home.html', controllerUrl: 'controllers/home_ctrl', navTab: 'home'
      }))
      .otherwise({redirectTo: '/home'});
  });

  // Define constant
  app.constant('SiteName', '/angularAMD');

  // Bootstrap Angular when DOM is ready
  return angularAMD.bootstrap(app);

});
