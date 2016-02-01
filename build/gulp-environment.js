'use strict';

let through = require('through2'),
    theme = require('../configuration/app').theme,
    pluginError = require('gulp-util').PluginError,
    fs = require('fs'),
    path = require('path'),
    configuration = require('../configuration/build');

function addEnvironment(file) {
    let content = file.contents.toString();
    let basePath = __dirname+'/includes';
    let includes = [basePath+'/file-system.js', basePath+'/fs.js', basePath+'/require.js']
        .reduce((prev, path) => {
            return fs.readFileSync(path, 'utf8') + prev
        }, '');
    let start = `\n new Function(fs.getFile('${configuration.main}'))()`;
    let result = `(function() { 'use strict'; \n ${includes + content + start} \n })();`;
    if(file.isStream()) {
        let stream = through();
        stream.write(result);
        file.contents = stream;
        return file
    } else if(file.isBuffer()) {
        file.contents = new Buffer(result);
        return file
    } else {
        this.emit('error', new pluginError('gulp-environment', 'file is not either stream or buffer'))
    }
}

module.exports = () => {
    return through.obj((file, encoding, callback)=> {
        return callback(null, addEnvironment.call(this, file))
    });
};
