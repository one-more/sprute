'use strict';

let process = require('process'),
    traceur = require('gulp-traceur'),
    lazypipe = require('lazypipe'),
    uglify = require('gulp-uglify'),
    filter = require('gulp-filter'),
    jsonminify = require('gulp-jsonminify');

let vendorPath = 'bower_components';
let vendorJS = [
    vendorPath+'/backbone/backbone.js',
    vendorPath+'/jquery/dist/**/*.js',
    vendorPath+'/jquery/*.json',
    vendorPath+'/jsmart/jsmart.min.js',
    vendorPath+'/smart-plurals/**/+(*.js|*.json)',
    vendorPath+'/underscore/underscore.js',
    traceur.RUNTIME_PATH
];

let jsFilter = filter('**/*.js', {restore: true}),
    jsonFilter = filter('**/*.json', {restore: true});

let bundleOptions = {
    transforms: {
        js: lazypipe().pipe(traceur)
    },
    minifyJS: true,
    minifyStyles: true,
    minifyTemplates: true,
    watchJS: true,
    watchStyles: true,
    watchTemplates: true
};

module.exports = {
    bundles: {
        'app-vendor': {
            js: vendorJS,
            options: {
                transforms: {
                    js: lazypipe()
                        .pipe(() => jsFilter)
                        .pipe(uglify)
                        .pipe(() => jsFilter.restore)
                        .pipe(() => jsonFilter)
                        .pipe(jsonminify)
                        .pipe(() => jsonFilter.restore)
                },
                minifyJS: false
            }
        },
        app: {
            js: [
                'front/**/*.js',
                'common/**/*.js',
                'configuration/routes.js',
                'configuration/runtime.js',
                'configuration/components.js'
            ],
            options: bundleOptions
        }
    },
    build: process.cwd()+'/static/build',
    bundleResult: process.cwd()+'/static/build-result.js',
    clean: 'static/build/*',
    prefix: '/build'
};