module.exports = function(grunt) {
    grunt.config('clean', {
        dist: {
            files: [{
                dot: true,
                src: [
                    '.tmp',
                    '<%= config.dist %>/*',
                    '!<%= config.dist %>/.git*'
                ]
            }]
        },
        server: '.tmp'
    });
    return grunt;
};
