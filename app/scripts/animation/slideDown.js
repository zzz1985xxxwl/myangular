define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.animation('.slide-down', function () {
    return {
      beforeAddClass: function (element) {
        $(element).slideDown(150);
      },
      beforeRemoveClass: function (element) {
        $(element).slideUp(100);
      }
    };
  });
});
