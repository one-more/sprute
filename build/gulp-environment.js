'use strict';

let through = require('through2'),
    process = require('process'),
    theme = require(process.cwd()+'/configuration/app').theme,
    pluginError = require('gulp-util').PluginError;

function addEnvironment(file) {
    if(file.isStream()) {
        let stream = through();
        stream.write(module);
        file.contents = stream;
        return file
    } else if(file.isBuffer()) {
        file.contents = new Buffer(module);
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
