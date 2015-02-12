'use strict';

module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    config: {
      app: 'app',
      dist: 'dist'
    }
  });

  grunt.loadTasks('./grunt');

  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'less:dev',
      'copy:fonts',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  return grunt;
};
