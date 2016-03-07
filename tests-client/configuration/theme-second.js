'use strict';

let process = require('process'),
    themePath = process.cwd()+'/tests-client/themes/second',
    templatesPath = themePath+'/templates',
    jsPath = themePath+'/js',
    viewsPath = jsPath+'/views';

let bundleOptions = {
    watchJS: true,
    watchTemplates: true
};

module.exports = {
    path: themePath,
    templatesPath,
    viewsPath,
    bundles: {
        'tests-common': {},
        'theme-second': {
            templates: [templatesPath+'/**/*.html'],
            js: [jsPath+'/**/*.js'],
            options: Object.assign({}, bundleOptions)
        }
    }
};