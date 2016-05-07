'use strict';

const process = require('process'),
    basePath = process.cwd()+'/tests-client',
    themePath = process.cwd()+'/tests-client/themes/test',
    templatesPath = themePath+'/templates',
    jsPath = themePath+'/js',
    viewsPath = jsPath+'/views',
    commonPath = basePath+'/common';

try {
    const lazypipe = require('lazypipe'),
        uglify = require('gulp-uglify'),
        jsonminify = require('gulp-jsonminify');

    var bundleOptions = {
        watchJS: true,
        watchTemplates: true,
        minifyJS: false,
        transforms: {
            js: (() => {
                let jsFilter, jsonFilter;
                lazypipe()
                    .pipe(() => jsFilter = filter('**/*.js', {restore: true}))
                    .pipe(uglify)
                    .pipe(() => jsFilter.restore)
                    .pipe(() => jsonFilter = filter('**/*.json', {restore: true}))
                    .pipe(jsonminify)
                    .pipe(() => jsonFilter.restore)
            })()
        }
    };
} catch(e) {
    bundleOptions = {}
}

module.exports = {
    path: themePath,
    templatesPath,
    viewsPath,
    bundles: {
        'tests-common': {
            js: [
                commonPath+'/routers/**/*.js',
                commonPath+'/views/**/*.js',
                commonPath+'/mappers/**/*.js',
                basePath+'/configuration/theme-test.js',
                basePath+'/configuration/theme-second.js',
                basePath+'/configuration/seo.js',
                basePath+'/bower_components/lightgallery/bower.json',
                basePath+'/bower_components/lightgallery/dist/js/lightgallery.min.js',
                basePath+'/bower_components/socket.io-client/socket.io.js'
            ],
            options: Object.assign({}, bundleOptions)
        },
        'theme-test': {
            templates: [templatesPath+'/**/*.html'],
            js: [jsPath+'/**/*.js', jsPath+'/**/*.json'],
            options: Object.assign({}, bundleOptions)
        }
    }
};