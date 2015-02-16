'use strict';
require.config({
  // alias libraries paths
  paths: {
    'jquery': '../../bower_components/jquery/dist/jquery',
    'angular': '../../bower_components/angular/angular',
    'angular-route': '../../bower_components/angular-route/angular-route',
    'angular-animate': '../../bower_components/angular-animate/angular-animate',
    'angular-cookies': '../../bower_components/angular-cookies/angular-cookies',
    'angular-resource': '../../bower_components/angular-resource/angular-resource',
    'angular-sanitize': '../../bower_components/angular-sanitize/angular-sanitize',
    'bootstrap': '../../bower_components/bootstrap/dist/js/bootstrap',
    'angularAMD': '../../bower_components/angularAMD/angularAMD'
  },

  // Add angular modules that does not support AMD out of the box, put it in a shim
  shim: {
    'angularAMD': ['angular'],
    'angular-route': ['angular'],
    'angular-animate':['angular'],
    'angular-cookies':['angular'],
    'angular-resource':['angular'],
    'angular-sanitize':['angular'],
    'bootstrap':['jquery']
  },

  // kick start application
  deps: ['app']
});

