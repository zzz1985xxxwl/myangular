'use strict';

define([
  './controllers/main',
  './directives/helloworld',
  './services/book'
], function () {
  return angular.module('app', [
    'ngRoute',
    'app.controllers',
    'app.directives',
    'app.services'
  ]);
});

