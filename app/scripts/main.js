require.config({
  paths: {
    'jquery': '/bower_components/jquery/dist/jquery',
    'angular': '/bower_components/angular/angular',
    'angular-route': '/bower_components/angular-route/angular-route',
    'angular-animate': '/bower_components/angular-animate/angular-animate',
    'angular-cookies': '/bower_components/angular-cookies/angular-cookies',
    'angular-resource': '/bower_components/angular-resource/angular-resource',
    'angular-sanitize': '/bower_components/angular-sanitize/angular-sanitize',
    'app': 'app'
  },
  shim: {
    'angular-route': {
      deps: ['angular']
    },
    'angular-animate': {
      deps: ['angular']
    },
    'angular-cookies': {
      deps: ['angular']
    },
    'angular-resource': {
      deps: ['angular']
    },
    'angular-sanitize': {
      deps: ['angular']
    },
    'app': {
      deps: ['jquery', 'angular', 'angular-route', 'angular-animate', 'angular-cookies', 'angular-resource', 'angular-sanitize']
    }
  }
});

define(['./routes'], function () {

  // 启动ng
  angular.bootstrap(document, ['app']);

});
