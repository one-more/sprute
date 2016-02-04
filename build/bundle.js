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
    htmlmin = require('gulp-htmlmin');

function buildJS(name, bundle) {
    let fileName = `${name}.${getFileName(bundle.js)}.js`;
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
    ]).on('error', console.error.bind(console))
}

function buildStyles(name, bundle) {
    let fileName = `${name}.${getFileName(bundle.styles)}.js`;
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
    ]).on('error', console.error.bind(console))
}

function buildTemplates(name, bundle) {
    let fileName = `${name}.${getFileName(bundle.templates)}.js`;
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
    ]).on('error', console.error.bind(console))
}

function buildRuntime() {
    let src = ['./build/runtime/**/*.js'];
    let fileName = `runtime.${getFileName(src)}.js`;
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
    fs.writeFileSync(build.bundleResult, `module.exports = ${JSON.stringify(buildResult)}`)
}

function emptyTransforms(file) {
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