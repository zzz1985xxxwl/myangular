'use strict';
require.config({
	// alias libraries paths
	paths: {
		'jquery': '../../bower_components/jquery/dist/jquery',
		'angular': '../../bower_components/angular/angular',
		'angular-route': '../../bower_components/angular-route/angular-route',
		'angular-animate': '../../bower_components/angular-animate/angular-animate',
		'angular-cookies': '../../bower_components/angular-cookies/angular-cookies',
		'angular-resource': '../../bower_components/angular-resource/angular-resource',
		'angular-sanitize': '../../bower_components/angular-sanitize/angular-sanitize',
		'angular-bootstrap': '../../bower_components/angular-bootstrap/ui-bootstrap-tpls',
		'angularAMD': '../../bower_components/angularAMD/angularAMD',
		'angular-bootstrap-show-errors': '../../bower_components/angular-bootstrap-show-errors/src/showErrors',
		'angularLocalStorage': '../../bower_components/angularLocalStorage/src/angularLocalStorage',
		'blockUI': '../../bower_components/angular-block-ui/dist/angular-block-ui',
		'inform': '../../bower_components/angular-inform/dist/angular-inform',
		'util': 'plugins/util',
		'drag-event': 'plugins/jquery.event.drag-2.2',
		'drop-event': 'plugins/jquery.event.drop-2.2'
	},

	// Add angular modules that does not support AMD out of the box, put it in a shim
	shim: {
		'angularAMD': ['angular'],
		'angular-route': ['angular'],
		'angular-animate': ['angular'],
		'angular-cookies': ['angular'],
		'angular-resource': ['angular'],
		'angular-sanitize': ['angular'],
		'angular-bootstrap': ['angular'],
		'angular-bootstrap-show-errors': ['angular'],
		'util': ['jquery'],
		'angularLocalStorage': ['angular', 'angular-cookies'],
		'blockUI': ['angular'],
		'inform': ['angular'],
		'drag-event':['jquery'],
		'drop-event':['jquery']
	},

	// kick start application
	deps: ['app']
});

