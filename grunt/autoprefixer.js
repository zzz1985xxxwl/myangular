module.exports = function(grunt) {
    grunt.config('autoprefixer', {
        options: {
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
        },
        dist: {
            files: [{
                expand: true,
                cwd: '.tmp/styles/',
                src: '{,*/}*.css',
                dest: '.tmp/styles/'
            }]
        }
    });
    return grunt;
};
