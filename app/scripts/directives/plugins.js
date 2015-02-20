define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.directive('dlGrid', function ($compile) {
    return {
      restrict: 'A',
      link: function (scope, element,attrs) {
        var $element=$(element),grid=scope[attrs.dlGrid],onSuccess=grid.onSuccess;

        grid.onSuccess=function(){
          if(onSuccess)onSuccess();
          $compile($element)(scope);
        };
        $element.Grid(grid);
        grid.getElement=function(){
          return $element;
        };
        grid.load=function(pageIndex){
          $element.Grid("load",pageIndex);
        };
        grid.getData=function(){
          $element.Grid("getData");
        };
      }
    };
  }).directive('toggle',function(){
    return{
      restrict:'A',
      link:function(scope,element,attrs){
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
  }).directive('template',function(){
    return{
      restrict:'A',
      link:function(scope,element,attrs){
        attrs['template']
      }
    }
  });
});
