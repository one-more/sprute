'use strict';

let through = require('through2'),
    pluginError = require('gulp-util').PluginError,
    fs = require('fs'),
    path = require('path'),
    configuration = require('../configuration/build');

function addEnvironment(file) {
    let content = file.contents.toString();
    let globals = '';
    let globalsPath = __dirname+'/globals';
    fs.readdirSync(globalsPath).forEach(file => {
        globals += fs.readFileSync(`${globalsPath}/${file}`, 'utf8')
    });
    let start = `
        new Function('fileSystem', fileSystem.getFile('${configuration.main}'))(fileSystem)
    `;
    let result = `(function() { 'use strict'; \n ${globals + content + start} \n })();`;
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
