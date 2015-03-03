define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.directive('portlet', function () {
    return {
      restrict: 'EAC',
      link: function (scope, element) {
        var $element = $(element), $portletBody = $element.children('.portlet-body');
        $element.on('click', 'a.fa-chevron-down', function () {
          var $this = $(this);
          if ($portletBody.is(':visible')) {
            $portletBody.slideUp(300);
            $this.addClass('a-rotate-180');
          } else {
            $portletBody.slideDown(300);
            $this.removeClass('a-rotate-180');
          }
        }).on('click', 'a.fa-close', function () {
          $element.animate({
            height: 0,
            opacity: 0
          }, 200, function () {
            $element.remove();
          });
        }).on('click','a.fa-expand',function(){
          $(this).removeClass('fa-expand').addClass('fa-compress');
          $element.addClass('portlet-fullscreen');
        }).on('click','a.fa-compress',function(){
          $(this).removeClass('fa-compress').addClass('fa-expand');
          $element.removeClass('portlet-fullscreen');
        });
      }
    };
  });
});
