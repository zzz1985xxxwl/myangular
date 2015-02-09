module.exports = function(grunt) {
    grunt.config('jshint', {
        options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish')
        },
        all: [
            'Gruntfile.js',
            '<%= config.app %>/scripts/{,*/}*.js',
            '!<%= config.app %>/scripts/vendor/*',
            'test/spec/{,*/}*.js'
        ]
    });
    return grunt;
};