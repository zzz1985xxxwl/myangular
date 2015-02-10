define(['./module'],function(module) {
  module.directive('hello', function () {
    return {
      restrict: 'A',
      template: '<span>hello world</span>',
      //templateUrl:'',
      replace: false,//是否替换现有节点
      transclude: true,
      link: function postLink(scope, element, attrs) {


      },
      compile: function () {

      }
    }
  });
});
