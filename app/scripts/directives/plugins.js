define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.directive('dlGrid', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        $(element).Grid(scope.gridConfig);
      }
    };
  }).directive('toggle',function(){
    return{
      restrict:'A',
      link:function(scope,element,attrs,ngModel){
        if(attrs.toggle!=='dropdown'){
          return;
        }
        if(attrs.hover==="dropdown"){
          $(element).on('mouseover',function(){
            $("[data-toggle=dropdown]").parent().removeClass('open');
            $(element).parent().addClass('open');
          })
        }
      }
    }
  });
});
