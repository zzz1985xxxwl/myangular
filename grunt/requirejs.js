module.exports = function(grunt) {
  grunt.config('requirejs', {
    compile: {
      options: {
        name: 'config',
        mainConfigFile: 'app/scripts/config.js',
        out: 'tmp/scripts/main.js',
        optimize: "uglify"
      }
    }
  });
  return grunt;
};
