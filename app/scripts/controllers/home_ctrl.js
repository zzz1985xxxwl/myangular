
define(['app'], function () {
  'use strict';
  return ['$scope','$compile', function ($scope) {
    $scope.searchParam = {
      name: ""
    };
    $scope.search = function () {
      $scope.grid.load(1);
    };
    $scope.grid = {
      colModel: [
        {display: 'Col1', displayAlign: 'center', width: '25%', name: 'Col1', sortable: true, treeNode: true},
        {display: 'Col2', displayAlign: 'center', width: '25%', name: 'Col2', align: 'left', sortable: true},
        {display: 'Col3', displayAlign: 'center', width: '25%', name: 'Col3', align: 'left'},
        {
          display: 'Col4',
          displayAlign: 'center',
          width: '25%',
          name: 'Col4',
          align: 'left',
          content: '<a ng-click="hello()">delete{{Col4}}</a>'
        }
      ],
      params: function () {
        return $scope.searchParam;
      },
      url: "/grid-data.json",
      orderBy: 'col1 desc'
    };

    $scope.hello=function(){
      console.log(123);
    };
    $scope.grid2 = {
      colModel: [
        {display: 'Col1', displayAlign: 'center', width: 100, name: 'Col1', sortable: true, fix: true},
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
      url: "/grid-data.json",
      orderBy: 'col1 desc'
    };

  }];
});
