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
    vendorPath+'/underscore/underscore.js',
    traceur.RUNTIME_PATH
];

let modulesJS = [
    vendorPath+'/jsmart/jsmart.min.js',
    vendorPath+'/smart-plurals/**/+(*.js|*.json)',
    'node_modules/livr/*.json',
    'node_modules/livr/lib/**/*.js',
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

let vendorOptions = {
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
};

module.exports = {
    bundles: {
        'app-vendor': {
            js: vendorJS,
            options: vendorOptions
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
    modules: {
        js: modulesJS,
        options: vendorOptions
    },
    build: process.cwd()+'/static/build',
    bundleResult: process.cwd()+'/static/build-result.js',
    clean: 'static/build/*',
    prefix: '/build'
};