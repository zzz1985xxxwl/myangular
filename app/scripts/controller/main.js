'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
    .controller('MainCtrl', function($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.now = new Date();


        var tt = function() {
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.now = new Date();
                })
                tt();
            }, 1000);
        }
        tt();
    });
