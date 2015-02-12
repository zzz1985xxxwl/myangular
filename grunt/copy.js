module.exports = function (grunt) {
  grunt.config('copy', {
    dist: {
      files: [{
        expand: true,
        dot: true,
        cwd: '<%= config.app %>',
        dest: '<%= config.dist %>',
        src: [
          '*.{ico,png,txt}',
          'images/{,*/}*.webp',
          '{,*/}*.html',
          'styles/fonts/{,*/}*.*'
        ]
      }, {
        src: 'node_modules/apache-server-configs/dist/.htaccess',
        dest: '<%= config.dist %>/.htaccess'
      }, {
        expand: true,
        dot: true,
        cwd: 'bower_components/bootstrap/dist',
        src: 'fonts/*',
        dest: '<%= config.dist %>'
      }]
    },
    fonts: {
      expand: true,
      dot: true,
      cwd: 'bower_components',
      src:['bootstrap/fonts/**','fontawesome/fonts/**'],
      flatten: true,
      filter: 'isFile',
      dest: '.tmp/fonts/'
    }
  });
  return grunt;
};
