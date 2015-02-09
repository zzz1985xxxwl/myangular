module.exports = function(grunt) {
    grunt.config('htmlmin', {
        dist: {
            options: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                removeAttributeQuotes: true,
                removeCommentsFromCDATA: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true,
                removeRedundantAttributes: true,
                useShortDoctype: true
            },
            files: [{
                expand: true,
                cwd: '<%= config.dist %>',
                src: '{,*/}*.html',
                dest: '<%= config.dist %>'
            }]
        }
    });
    return grunt;
};
