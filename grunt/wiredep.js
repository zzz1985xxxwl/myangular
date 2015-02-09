module.exports = function(grunt) {
    grunt.config('wiredep', {
        app: {
            ignorePath: /^\/|\.\.\//,
            src: ['<%= config.app %>/index.html'],
            exclude: ['bower_components/bootstrap/dist/js/bootstrap.js']
        }
    });
    return grunt;
};
