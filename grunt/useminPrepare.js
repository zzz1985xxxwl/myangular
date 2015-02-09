module.exports = function(grunt) {
    grunt.config('useminPrepare', {
        options: {
            dest: '<%= config.dist %>'
        },
        html: '<%= config.app %>/index.html'
    });
    return grunt;
};
