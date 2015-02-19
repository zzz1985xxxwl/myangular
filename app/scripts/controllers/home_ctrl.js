define(['app'], function () {
  'use strict';
  return ['$scope', function ($scope) {
    $scope.gridConfig = {
      colModel: [
        {display: 'Col1', displayAlign: 'center', width: '25%', name: 'Col1', sortable: true, treeNode: true},
        {display: 'Col2', displayAlign: 'center', width: '25%', name: 'Col2', align: 'left', sortable: true},
        {display: 'Col3', displayAlign: 'center', width: '25%', name: 'Col3', align: 'left'},
        {display: 'Col4', displayAlign: 'center', width: '25%', name: 'Col4', align: 'left'}
      ],
      url: "/grid-data.json",
      orderBy: 'col1 desc',
      data: {
        rows: [
          {Col1: "hello", Col2: "C2", Col3: "C3", Col4: "c4", treeNode: "node-1"}
        ], page: 1, total: 1000
      }
    };
  }];
});
