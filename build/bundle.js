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
    combiner = require('stream-combiner2');

function buildJS(name, bundle) {
    let fileName = `${name}.${getFileName(bundle.js)}.js`;
    writeToResultFile(name, 'js', fileName);
    let options = Object.assign({
        transforms: {}
    }, bundle.options);
    combiner.obj([
        gulp.src(bundle.js),
        (options.transforms.js || emptyTransforms)(),
        (options.minify ? uglify : emptyTransforms)(),
        require('./gulp-modules')(),
        concat(fileName),
        gulp.dest(build.build)
    ]).on('error', console.error.bind(console))
}

function buildStyles(name, bundle) {
    let fileName = `${name}.${getFileName(bundle.styles)}.js`;
    writeToResultFile(name, 'styles', fileName);
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
    ]).on('error', console.error.bind(console))
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
    },

    buildRuntime: buildRuntime
};