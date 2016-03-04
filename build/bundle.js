'use strict';

let process = require('process'),
    build = require(process.cwd()+'/configuration/build'),
    gulp = require('gulp'),
    crypto = require('crypto'),
    concat = require('gulp-concat'),
    through = require('through2'),
    fs = require('fs'),
    traceur = require('gulp-traceur'),
    uglify = require('gulp-uglify'),
    combiner = require('stream-combiner2'),
    lazypipe = require('lazypipe'),
    cssmin = require('gulp-cssmin'),
    htmlmin = require('gulp-htmlmin'),
    watch = require('gulp-watch'),
    svgSprite = require('gulp-svg-sprite');

function addWatch(src, cb) {
    watch(src, cb);
}

function isDev() {
    return process.env.NODE_ENV ? process.env.NODE_ENV == 'development' : true
}

function buildJS(name, bundle) {
    let fileName = isDev() ? `${name}.js` : `${getFileName(bundle.js)}.${name}.js`;
    writeToResultFile(name, 'js', fileName);
    let options = Object.assign({
        transforms: {}
    }, bundle.options);
    combiner.obj([
        gulp.src(bundle.js),
        (options.transforms.js || emptyTransforms)(),
        (options.minifyJS ? uglify : emptyTransforms)(),
        require('./gulp-modules')(),
        concat(fileName),
        gulp.dest(build.build)
    ]).on('error', console.error.bind(console));

    if(options.watchJS) {
        addWatch(bundle.js, buildJS.bind(null, name, bundle))
    }
}

function buildStyles(name, bundle) {
    let fileName = isDev() ? `${name}.css` : `${getFileName(bundle.styles)}.${name}.css`;
    writeToResultFile(name, 'styles', fileName);
    let options = Object.assign({
        transforms: {}
    }, bundle.options);
    combiner.obj([
        gulp.src(bundle.styles),
        (options.transforms.styles || emptyTransforms)(),
        (options.minifyStyles ? cssmin : emptyTransforms)(),
        require('./gulp-modules')(),
        concat(fileName),
        gulp.dest(build.build)
    ]).on('error', console.error.bind(console));

    if(options.watchStyles) {
        addWatch(bundle.styles, buildStyles.bind(null, name, bundle))
    }
}

function buildTemplates(name, bundle) {
    let fileName = isDev() ? `${name}.js` : `${getFileName(bundle.templates)}.${name}.js`;
    writeToResultFile(name, 'templates', fileName);
    let options = Object.assign({
        transforms: {}
    }, bundle.options);
    combiner.obj([
        gulp.src(bundle.templates),
        (options.transforms.templates || emptyTransforms)(),
        (options.minifyTemplates ? htmlmin : emptyTransforms)(),
        require('./gulp-modules')(),
        concat(fileName),
        gulp.dest(build.build)
    ]).on('error', console.error.bind(console));

    if(options.watchTemplates) {
        addWatch(bundle.templates, buildTemplates.bind(null, name, bundle))
    }
}

function buildSVG (name, bundle) {

    gulp.src([bundle.svg])
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
}

function buildRuntime() {
    let src = ['./build/runtime/**/*.js'];
    let fileName = isDev() ? 'runtime.js' : `${getFileName(src)}.runtime.js`;
    writeToResultFile('runtime', 'js', fileName);
    combiner.obj([
        gulp.src(src),
        traceur(),
        uglify(),
        concat(fileName),
        wrapCode(),
        gulp.dest(build.build)
    ])
        .on('error', console.error.bind(console))
        .on('finish', addGlobalModules.bind(null, fileName));
}

function addGlobalModules(fileName) {
    let src = ['./build/global-modules/**/*.js'];

    combiner.obj([
        gulp.src(src),
        traceur(),
        uglify(),
        require('./gulp-modules')(),
        concat(fileName),
        appendFile(fileName)
    ]).on('error', console.error.bind(console));

    function appendFile(fileName) {
        return through.obj((file, encoding, callback) => {
            fs.appendFile(`${build.build}/${fileName}`, `\n${file.contents.toString()}`);
            return callback()
        });
    }
}

function getFileName(src) {
    return crypto.randomBytes(12).toString('hex')
}

function writeToResultFile(bundle, section, fileName) {
    let buildResult = require(build.bundleResult);
    !buildResult[bundle] && (buildResult[bundle] = {});
    buildResult[bundle][section] = fileName;
    fs.writeFileSync(build.bundleResult, `module.exports = ${JSON.stringify(buildResult, null, 4)}`)
}

function emptyTransforms() {
    return through.obj((file, encoding, callback) => {
        return callback(null, file)
    });
}

function wrapCode() {
    return through.obj((file, encoding, callback) => {
        let content = file.contents.toString();
        let result = `(function() { 'use strict'; ${content} })()`;
        if(file.isStream()) {
            let stream = through();
            stream.write(result);
            file.contents = stream
        } else if(file.isBuffer()) {
            file.contents = new Buffer(result)
        }
        return callback(null, file)
    });
}

module.exports = {
    build(name, bundle) {
        if(bundle.js) {
            buildJS(name, bundle)
        }
        if(bundle.styles) {
            buildStyles(name, bundle)
        }
        if(bundle.templates) {
            buildTemplates(name, bundle)
        }
    },

    buildRuntime: buildRuntime
};