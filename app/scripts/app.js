'use strict';
define(['angularAMD',
  'angular-route',
  'angular-animate',
  'angular-cookies',
  'angularLocalStorage',
  'blockUI',
  'inform',
  'plugins/grid',
  'controllers/sidebar_ctrl',
  'controllers/login_ctrl',
  'directives/portlet',
  'directives/plugins',
  'directives/validation',
  'animation/slideDown',
  'angular-resource',
  'angular-bootstrap',
  'angular-bootstrap-show-errors'], function (angularAMD) {
  var app = angular.module('dl-app', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngResource', 'ui.bootstrap', 'ui.bootstrap.showErrors','angularLocalStorage','blockUI','inform']);

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/home', angularAMD.route({
        templateUrl: 'views/home.html', controllerUrl: 'controllers/home_ctrl', nav: 'home'
      })).when('/table', angularAMD.route({
        templateUrl: 'views/table.html', controllerUrl: 'controllers/table_ctrl', nav: 'table'
      }))
      .otherwise({redirectTo: '/home'});
  }).config(function(blockUIConfig){
    blockUIConfig.message='';
    blockUIConfig.template ='<div class="block-ui-overlay"></div><div class="block-ui-message-container" aria-live="assertive" aria-atomic="true"><div class="loading-message loading-message-boxed"> <div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>{{state.message}}</div> </div></div>';
  }).config(function(informProvider) {
    informProvider.defaults({
      ttl: 2000,
      type: 'danger'
    });
  });

  // Define constant
  //app.constant('SiteName', '/angularAMD');

  // Bootstrap Angular when DOM is ready
  return angularAMD.bootstrap(app);

});
