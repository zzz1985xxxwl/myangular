module.exports = function(grunt) {
    grunt.config('watch', {
        bower: {
            files: ['bower.json'],
            tasks: ['wiredep']
        },
        js: {
            files: ['<%= config.app %>/scripts/{,*/}*.js'],
            tasks: ['jshint'],
            options: {
                livereload: true
            }
        },
        jstest: {
            files: ['test/spec/{,*/}*.js'],
            tasks: ['test:watch']
        },
        gruntfile: {
            files: ['Gruntfile.js']
        },
        // styles: {
        //     files: ['<%= config.app %>/styles/{,*/}*.css'],
        //     tasks: ['newer:copy:styles', 'autoprefixer']
        // },
        styles: {
            files: ['<%= config.app %>/styles/{,*/}*.less'],
            tasks: ['less:dev']
        },
        livereload: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            files: [
                '<%= config.app %>/{,*/}*.html',
                '.tmp/styles/{,*/}*.css',
                '<%= config.app %>/images/{,*/}*'
            ]
        }
    });
    grunt.registerTask('watch.js', ['watch:js']);
    grunt.registerTask('watch.styles', ['watch:styles']);
    grunt.registerTask('watch.livereload', ['watch:livereload']);
    return grunt;
};
