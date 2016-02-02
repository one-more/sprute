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
    theme = require('./configuration/app').theme,
    watch = require('gulp-watch'),
    configuration = require('./configuration/build'),
    paths = configuration.paths;

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

function buildOriginCSS(fileName) {
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
}

function buildVendorCSS(fileName) {
    return gulp.src(paths.vendorCSS)
        .pipe(cssmin())
        .pipe(concat(fileName))
        .pipe(gulp.dest(paths.dest))
}

function buildOriginJs(fileName) {
    return gulp.src(paths.js)
        .pipe(require('./build/gulp-includes')())
        .pipe(traceur())
        .pipe(uglify())
        .pipe(require('./build/gulp-modules')())
        .pipe(concat(fileName))
        .pipe(require('./build/gulp-environment')())
        .pipe(traceur())
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest))
}

function buildVendorJs(fileName) {
    return gulp.src(paths.vendorJS)
        .pipe(uglify())
        .pipe(concat(fileName))
        .pipe(gulp.dest(paths.dest))
}

gulp.task('build-css', () => {
    let fileNameOrigin = 'origin.'+crypto.randomBytes(12).toString('hex')+'.css';
    let fileNameVendor = 'vendor.'+crypto.randomBytes(12).toString('hex')+'.css';
    let buildResult = require(configuration.buildResult);
    buildResult.css = {};
    buildResult.css.origin = fileNameOrigin;
    buildResult.css.vendor = fileNameVendor;
    fs.writeFileSync(configuration.buildResult, `module.exports = ${JSON.stringify(buildResult)}`);

    buildOriginCSS(fileNameOrigin);
    buildVendorCSS(fileNameVendor)
});

gulp.task('build-js', () => {
    let fileNameOrigin = 'origin.'+crypto.randomBytes(12).toString('hex')+'.js';
    let fileNameVendor = 'vendor.'+crypto.randomBytes(12).toString('hex')+'.js';
    let buildResult = require(configuration.buildResult);
    buildResult.js = {};
    buildResult.js.origin = fileNameOrigin;
    buildResult.js.vendor = fileNameVendor;
    fs.writeFileSync(configuration.buildResult, `module.exports = ${JSON.stringify(buildResult)}`);

    buildOriginJs(fileNameOrigin);
    buildVendorJs(fileNameVendor)
});

gulp.task('clean', () => {
    return gulp.src(paths.deletePath)
        .pipe(rimraf())
});

gulp.task('watch', () => {
    watch(paths.js, () => {
        gulp.start('build-js')
    });
    watch(paths.css, () => {
        gulp.strt('build-css')
    })
});

gulp.task('default', ['clean', 'build-js', 'build-css', 'build-svg', 'watch']);