'use strict';

define([
  './directives/helloworld',
  './services/book',
  './controllers/main',
  './controllers/sidebar'
], function () {
  return angular.module('dl.app', [
    'ngRoute',
    'dl.app.controllers',
    'dl.app.directives',
    'dl.app.services'
  ]);
});

