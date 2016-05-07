'use strict';

const build = require('./configuration/build'),
    _ = require('underscore'),
    bundle = require('./build/bundle'),
    themes = require('./configuration/themes'),
    gulp = require('gulp'),
    rimraf = require('gulp-rimraf'),
    ignore = require('gulp-ignore');

gulp.task('bundle', () => {
    return [build].concat(_.pairs(themes).map(pair => pair[1])).reduce((promise, obj) => {
        return promise.then(() => {
            return _.pairs(obj.bundles).reduce((promise, pair) => {
                return promise.then(() => {
                    return bundle.build.apply(null, pair)
                })
            }, Promise.resolve());
        })
    }, Promise.resolve())
});

gulp.task('build-modules', () => {
    return bundle.build('modules', build.modules)
});

gulp.task('build-runtime', () => {
    return bundle.buildRuntime()
});

gulp.task('clean', () => {
    return gulp.src(build.clean, {read: false})
        .pipe(ignore('.gitkeep'))
        .pipe(rimraf())
});

gulp.task('default', ['clean', 'build-runtime', 'bundle', 'build-modules']);