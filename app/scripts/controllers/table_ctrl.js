define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.controller('EditController', function ($scope, $modalInstance, data) {
    $scope.item = {
      email: '',
      password: '',
      number: ''
    };
    $scope.ok = function () {
      $scope.$broadcast('show-errors-check-validity');
      if ($scope.myForm.$valid) {
        $modalInstance.close($scope.item);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
      $scope.$broadcast('show-errors-reset');
    };
  });

  return ['$scope', '$modal', 'blockUI', '$timeout', 'inform', function ($scope, $modal, blockUI, $timeout, inform) {
    var blockInstance = blockUI.instances.get('orders');
    $scope.searchParam = {
      name: ''
    };
    $scope.search = function () {
      inform.add('searching!');
      blockInstance.start();
      $scope.grid.load(1);
    };
    $scope.grid = {
      colModel: [
        {display: 'Col1', displayAlign: 'center', width: '200', name: 'Col1', sortable: true, treeNode: true},
        {display: 'Col2', displayAlign: 'center', width: '200', name: 'Col2', align: 'left', sortable: true},
        {display: 'Col3', displayAlign: 'center', width: '100', name: 'Col3', align: 'left'},
        {
          display: 'Col4',
          displayAlign: 'center',
          width: '100',
          name: 'Col4',
          align: 'left',
          content: '<a ng-click="hello()">delete{{Col4}}</a>'
        }
      ],
      params: function () {
        return $scope.searchParam;
      },
      url: '/grid-data.json',
      bulkMenuUrl: '/views/order/bulkmenu.html',
      orderBy: 'col1 desc',
      height: 370,
      onSuccess: function () {
        blockInstance.stop();
      }
    };
    $scope.getItem = function () {
      $scope.grid.getSelectedItem();
    };
    $scope.hello = function () {
      $scope.open('lg');
    };
    $scope.reload = function () {
      blockUI.start();
      $timeout(function () {
        blockUI.stop();
      }, 2000);
    };
    $scope.grid2 = {
      colModelFix:[{display: 'Col1', displayAlign: 'center', width: 100, name: 'Col1', sortable: true}],
      colModel: [
        {display: 'Col2', displayAlign: 'center', width: 200, name: 'Col2', align: 'left', sortable: true},
        {
          display: 'Col3',
          displayAlign: 'center',
          width: 200,
          name: 'Col3',
          align: 'left',
          content: '<span class="label label-sm label-success">{{Col3}}</span>'
        },
        {
          display: 'Col4',
          displayAlign: 'center',
          width: 200,
          name: 'Col4',
          align: 'left',
          content: '<a  class="btn default btn-xs purple"><i class="fa fa-edit"></i> Edit </a><a class="btn default btn-xs black"><i class="fa fa-trash-o"></i> Delete </a>'
        }
      ],
      params: function () {
        return $scope.searchParam;
      },
      url: '/grid-data.json',
      bulkMenuUrl: '/views/order/bulkmenu.html',
      orderBy: 'col1 desc'
    };
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'views/edit.html',
        controller: 'EditController',
        size: size,
        resolve: {
          data: function () {
            return {name: 1};
          }
        }
      });

      modalInstance.result.then(function (item) {
        console.log(item);
      }, function () {
      });
    };

  }];
});
