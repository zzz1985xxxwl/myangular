module.exports = function(grunt) {
    grunt.config('less', {
        dev: {
            options: {
                compress: true,
                yuicompress: false,
                optimization: 0
            },
            files: {
                ".tmp/styles/main.css": "<%=config.app%>/styles/main.less"
            }
        }
    });
    return grunt;
};
