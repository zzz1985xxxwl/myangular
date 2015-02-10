'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
define(['./module'], function (module) {
  module.controller('MainController', ['$scope', 'Book',function ($scope, book) {

    $scope.books = book.books;
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.now = new Date();

    $scope.addBook = function () {
      book.books.push({title: "Magician1", author: "Raymond E. Feis1t"});
      console.log(book);
    };
    var tt = function () {
      setTimeout(function () {
        $scope.$apply(function () {
          $scope.now = new Date();
        });
        tt();
      }, 1000);
    };
    tt();
  }]);
});

