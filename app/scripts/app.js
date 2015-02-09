'use strict';

define([
  './controllers/main',
  './directives/helloworld',
  './services/book'
], function () {
  return angular.module('dl.app', [
    'ngRoute',
    'dl.app.controllers',
    'dl.app.directives',
    'dl.app.services'
  ]);
});

