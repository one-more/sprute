'use strict';

let gulp = require('gulp'),
    bundle = require('gulp-bundle-assets'),
    rimraf = require('gulp-rimraf'),
    path = require('path'),
    svgSprite = require('gulp-svg-sprite'),
    theme = require('./configuration/app').theme,
    paths = {
        build: 'static/build',
        prefix: '/build/',
        deletePath: 'static/build',
        bundleConfigPath: theme.path+'/bundle-config.js',
        bundleResultsPath: 'static/build',
        svgSrc: 'static/build/images',
        js: ['front/vendor/**/*.js', theme.path+'/**/*.js', 'common/**/*.js']
    };

let svg2Sprite = function (src, dest) {
    gulp.src(['svg/**/*.svg'], {cwd: src})
        .pipe(svgSprite({
            shape: {
                id: {
                    generator: function(name) {
                        var _name = name.split('/');
                        return _name.pop();
                    }
                },
                transform: [
                    {svgo: {
                        plugins: [
                            {removeTitle: true}
                        ]
                    }}
                ]
            },
            svg: {
                namespaceClassnames: false,
                doctypeDeclaration: false,
                transform: function (svg) {
                    return svg.replace(/\#[\w]*/gi, 'currentColor').replace(/<symbol/gi, "\n<symbol");
                }
            },
            mode: {
                symbol: {
                    dest: ''
                }
            }
        }))
        .on('error', console.log)
        .pipe(gulp.dest(dest));
};

gulp.task('build-svg', function () {
    svg2Sprite(paths.svgSrc, paths.svgSrc);
});

gulp.task('bundle', ['clean', 'build-svg'], () => {
    return gulp.src(paths.bundleConfigPath)
        .pipe(bundle())
            .on('error', console.log.bind(console))
        .pipe(bundle.results({
                dest: paths.bundleResultsPath,
                pathPrefix: paths.prefix
            }))
        .pipe(gulp.dest(paths.build))
});

gulp.task('build-js', () => {
    return gulp.src(paths.js)
        .pipe(require('./static/builder')())
});

gulp.task('clean', () => {
    return gulp.src(paths.deletePath)
        .pipe(rimraf())
});

gulp.task('watch', () => {
    bundle.watch({
        configPath: path.join(__dirname, paths.bundleConfigPath),
        results: {
            dest: path.join(__dirname, paths.bundleResultsPath),
            pathPrefix: paths.prefix
        },
        dest: path.join(__dirname, paths.build)
    })
});

gulp.task('default', ['bundle', 'watch']);