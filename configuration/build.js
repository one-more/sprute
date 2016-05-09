'use strict';

const babel = require('gulp-babel'),
    lazypipe = require('lazypipe'),
    uglify = require('gulp-uglify'),
    filter = require('gulp-filter'),
    jsonminify = require('gulp-jsonminify'),
    staticParams = require('./static'),
    vendorPath = 'bower_components';

let bundleOptions = {
    transforms: {
        js: lazypipe().pipe(babel, {
            'presets': ['es2015']
        })
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
            js: [
                vendorPath+'/jquery/dist/jquery.js',
                vendorPath+'/jquery/bower.json',
                vendorPath+'/underscore/underscore.js',
                'static/bundle-result.js'
            ],
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
                'configuration/theme-light.js',
                'configuration/i18n.js',
                'configuration/socket-server.js',
                'configuration/app.js'
            ],
            options: bundleOptions
        }
    },
    modules: {
        js: [
            vendorPath+'/jsmart/jsmart.min.js',
            vendorPath+'/smart-plurals/package.json',
            vendorPath+'/smart-plurals/dist/Smart.Plurals.node/Smart.Plurals.node-all.js',
            'node_modules/livr/*.json',
            'node_modules/livr/lib/**/*.js',
            'back/modules/knex/knex.js',
            vendorPath+'/bluebird/bower.json',
            vendorPath+'/bluebird/js/browser/bluebird.js',
            vendorPath+'/socket.io-client/socket.io.js'
        ],
        options: modulesOptions
    },
    build: staticParams.build,
    bundleResult: staticParams.bundleResult,
    clean: staticParams.clean,
    prefix: staticParams.prefix
};