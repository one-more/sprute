'use strict';

const process = require('process'),
    path = require('path');

global.basePath = __dirname;

process.chdir('../');

const bundle = require(process.cwd()+'/build/bundle'),
    gulp = require('gulp'),
    themeTest = require(basePath+'/configuration/theme-test'),
    themeSecond = require(basePath+'/configuration/theme-second'),
    _ = require('underscore'),
    vendorPath = __dirname+'/bower_components',
    jsonminify = require('gulp-jsonminify'),
    uglify = require('gulp-uglify'),
    lazypipe = require('lazypipe'),
    filter = require('gulp-filter');

const modules = {
    bundles: {
        'test-client-modules': {
            js: [
                vendorPath+'/moment/bower.json',
                vendorPath+'/moment/moment.js',
                vendorPath+'/moment/locale/ru.js'
            ],
            options: {
                transforms: {
                    js: vendorTransforms()
                },
                minifyJS: false,
                watchJS: true,
                watchJSGlob: [
                    vendorPath+'/moment/**/*.js'
                ]
            }
        }
    }
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

gulp.task('default', () => {
    return [modules, themeTest, themeSecond].reduce((promise, obj) => {
        return promise.then(() => {
            return _.pairs(obj.bundles).reduce((promise, pair) => {
                return promise.then(() => {
                    return bundle.build.apply(null, pair)
                })
            }, Promise.resolve());
        })
    }, Promise.resolve())
});