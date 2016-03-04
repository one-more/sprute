'use strict';

module.exports = function(grunt) {
    // Load the plugins that provide the tasks we specified in package.json
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        blanket_mocha: {
            options: {
                run: true,
                reporter: 'Min',
                // We want a minimum of 70% coverage
                threshold: 70
            },
            files: {
                src: 'common/**/*.html'
            }
        }
    });

    grunt.registerTask('default', ['blanket_mocha']);
};