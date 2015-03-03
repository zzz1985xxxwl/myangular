(function($) {
  'use strict';
  var dl = $.dl = {};

  dl.utils = {};
  dl.utils.template = function(str, data) {
    for(var prop in data){
      var reg=new RegExp('{{'+prop+'}}',['g']);
      str=str.replace(reg,data[prop]);
    }
    return str;
  };

})(jQuery);
