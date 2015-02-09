module.exports = function(grunt) {
    grunt.config('usemin', {
        options: {
            assetsDirs: [
                '<%= config.dist %>',
                '<%= config.dist %>/images',
                '<%= config.dist %>/styles'
            ]
        },
        html: ['<%= config.dist %>/{,*/}*.html'],
        css: ['<%= config.dist %>/styles/{,*/}*.css']
    });
    return grunt;
};
