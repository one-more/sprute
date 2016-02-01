'use strict';

let gulp = require('gulp'),
    rimraf = require('gulp-rimraf'),
    svgSprite = require('gulp-svg-sprite'),
    traceur = require('gulp-traceur'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    cssnext = require('gulp-cssnext'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    concat = require('gulp-concat'),
    crypto = require('crypto'),
    fs = require('fs'),
    process = require('process'),
    theme = require(process.cwd()+'/configuration/app').theme,
    watch = require('gulp-watch'),
    paths = {
        deletePath: 'static/build',
        svgSrc: 'static/build/images',
        js: ['front/**/*.js', theme.path+'/**/*.js', 'common/**/*.js'],
        css: [theme.path+'/**/*.styl', 'front/**/*.css'],
        dest: 'static/build'
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

gulp.task('build-css', () => {
    let fileName = crypto.randomBytes(12).toString('hex')+'.css';
    let buildResult = require(process.cwd()+'/static/build-result');
    buildResult.css = fileName;
    fs.writeFileSync('./static/build-result.js', `module.exports = ${JSON.stringify(buildResult)}`);
    return gulp.src(paths.css)
        .pipe(stylus({
            include: theme.buildOptions.stylus.includes || [],
            import: ['nib'].concat(theme.buildOptions.stylus.imports || []),
            use: nib()
        }))
        .pipe(cssmin())
        .pipe(cssnext({
            compress: true
        }))
        .pipe(concat(fileName))
        .pipe(gulp.dest(paths.dest))
});

gulp.task('build-js', () => {
    let fileName = crypto.randomBytes(12).toString('hex')+'.js';
    let buildResult = require(process.cwd()+'/static/build-result');
    buildResult.js = fileName;
    fs.writeFileSync('./static/build-result.js', `module.exports = ${JSON.stringify(buildResult)}`);
    return gulp.src(paths.js)
        .pipe(traceur())
        .pipe(uglify())
        .pipe(require('./gulp-modules')())
        .pipe(concat(fileName))
        .pipe(require('./gulp-environment')())
        .pipe(gulp.dest(paths.dest))
});

gulp.task('clean', () => {
    return gulp.src(paths.deletePath)
        .pipe(rimraf())
});

gulp.task('watch', () => {
    gulp.watch(paths.js, () => {
        gulp.task('build-js')
    });
    gulp.watch(paths.css, () => {
        gulp.task('build-css')
    })
});

gulp.task('default', ['clean', 'build-js', 'build-css', 'build-svg', 'watch']);