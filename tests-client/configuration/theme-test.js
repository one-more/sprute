'use strict';

let process = require('process'),
    basePath = process.cwd()+'/tests-client',
    themePath = process.cwd()+'/tests-client/themes/test',
    templatesPath = themePath+'/templates',
    jsPath = themePath+'/js',
    viewsPath = jsPath+'/views',
    commonPath = basePath+'/common';

let bundleOptions = {
    watchJS: true,
    watchTemplates: true
};

module.exports = {
    path: themePath,
    templatesPath,
    viewsPath,
    bundles: {
        'tests-common': {
            js: [
                commonPath+'/routers/**/*.js',
                commonPath+'/views/**/*.js',
                basePath+'/configuration/theme-test.js',
                basePath+'/configuration/theme-second.js'
            ],
            options: Object.assign({}, bundleOptions)
        },
        'theme-test': {
            templates: [templatesPath+'/**/*.html'],
            js: [jsPath+'/**/*.js'],
            options: Object.assign({}, bundleOptions)
        }
    }
};