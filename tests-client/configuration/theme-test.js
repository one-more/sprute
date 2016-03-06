'use strict';

let themePath = basePath+'/themes/test',
    templatesPath = themePath+'/templates',
    commonPath = basePath+'/common';

let bundleOptions = {
    watchJS: true,
    watchTemplates: true
};

module.exports = {
    path: themePath,
    templatesPath,
    bundles: {
        'tests-common': {
            js: [
                commonPath+'/routers/**/*.js',
                commonPath+'/views/**/*.js',
                commonPath+'/configuration/theme-test.js'
            ],
            options: bundleOptions
        },
        'theme-test': {
            templates: [templatesPath+'/**/*.html'],
            options: bundleOptions
        }
    }
};