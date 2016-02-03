'use strict';

let process = require('process'),
    traceur = require('gulp-traceur'),
    lazypipe = require('lazypipe'),
    uglify = require('gulp-uglify');

let vendorPath = 'bower_components';
let vendorJS = [
    vendorPath+'/jquery/dist/jquery.min.js',
    vendorPath+'/underscore/underscore-min.js',
    vendorPath+'/backbone/backbone-min.js',
    vendorPath+'/jsmart/jsmart.min.js',
    vendorPath+'/smart-plurals/dist/Smart.Plurals/Smart.Plurals.all-min.js',
    traceur.RUNTIME_PATH
];

let bundleOptions = {
    transforms: {
        js: lazypipe().pipe(traceur)
    },
    minify: true
};

module.exports = {
    bundles: {
        'app-vendor': {
            js: vendorJS,
            options: {
                minify: true
            }
        },
        app: {
            js: [
                'front/**/*.js',
                'common/**/*.js',
                'configuration/routes.js'
            ],
            options: bundleOptions
        }
    },
    build: process.cwd()+'/static/build',
    bundleResult: process.cwd()+'/static/build-result.js',
    main: './front/index.js',
    clean: 'static/build/*',
    prefix: '/build'
};