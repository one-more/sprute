'use strict';

let process = require('process'),
    traceur = require('gulp-traceur'),
    lazypipe = require('lazypipe'),
    uglify = require('gulp-uglify'),
    filter = require('gulp-filter'),
    jsonminify = require('gulp-jsonminify'),
    staticParams = require('./static');

let vendorPath = 'bower_components';
let vendorJS = [
    vendorPath+'/backbone/backbone.js',
    vendorPath+'/jquery/dist/jquery.js',
    vendorPath+'/jquery/bower.json',
    vendorPath+'/underscore/underscore.js',
    traceur.RUNTIME_PATH,
    'static/build-result.js'
];

let modulesJS = [
    vendorPath+'/jsmart/jsmart.min.js',
    vendorPath+'/smart-plurals/package.json',
    vendorPath+'/smart-plurals/dist/Smart.Plurals.node/Smart.Plurals.node-all.js',
    'node_modules/livr/*.json',
    'node_modules/livr/lib/**/*.js',
    'back/modules/knex/knex.js',
    vendorPath+'/bluebird/bower.json',
    vendorPath+'/bluebird/js/browser/bluebird.js'
];

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

function vendorTransforms() {
    let jsFilter, jsonFilter;
    return lazypipe()
        .pipe(() => jsFilter = filter('**/*.js', {restore: true}))
        .pipe(uglify)
        .pipe(() => jsFilter.restore)
        .pipe(() => jsonFilter = filter('**/*.json', {restore: true}))
        .pipe(jsonminify)
        .pipe(() => jsonFilter.restore)
}

let vendorOptions = {
    transforms: {
        js: vendorTransforms()
    },
    minifyJS: false
};

let modulesOptions = Object.assign(vendorOptions, {
    transforms: {
        js: vendorTransforms()
    }
});

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
                'configuration/components.js',
                'configuration/static.js',
                'configuration/theme-light.js'
            ],
            options: bundleOptions
        }
    },
    modules: {
        js: modulesJS,
        options: modulesOptions
    },
    build: staticParams.build,
    bundleResult: staticParams.bundleResult,
    clean: staticParams.clean,
    prefix: staticParams.prefix
};