'use strict';

let build = require('./configuration/build'),
    _ = require('underscore'),
    bundle = require('./build/bundle'),
    themes = require('./configuration/themes'),
    gulp = require('gulp'),
    rimraf = require('gulp-rimraf');

gulp.task('bundle', () => {
    [build].concat(_.pairs(themes).map(pair => pair[1])).forEach(obj => {
        _.pairs(obj.bundles).forEach(pair => {
            bundle.build.apply(null, pair)
        });
    })
});

gulp.task('build-runtime', () => {
    bundle.buildRuntime()
});

gulp.task('clean', () => {
    return gulp.src(build.clean)
        .pipe(rimraf())
});

gulp.task('default', ['clean', 'build-runtime', 'bundle']);