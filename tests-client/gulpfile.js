'use strict';

let process = require('process'),
    path = require('path');

global.basePath = __dirname;

process.chdir('../');

let bundle = require(process.cwd()+'/build/bundle'),
    gulp = require('gulp'),
    themeTest = require(basePath+'/configuration/theme-test'),
    _ = require('underscore');

gulp.task('default', () => {
    return [themeTest].reduce((promise, obj) => {
        return promise.then(() => {
            return _.pairs(obj.bundles).reduce((promise, pair) => {
                return promise.then(() => {
                    return bundle.build.apply(null, pair)
                })
            }, Promise.resolve());
        })
    }, Promise.resolve())
});