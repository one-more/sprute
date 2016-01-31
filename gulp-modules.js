'use strict';

let through = require('through2');

function makeModule(file) {
    let content = file.contents.toString().replace(/'/g, "\\'").replace(/"/g, '\\"');
    let module = `fileSystem['${file.relative}'] = '${content}';`;
    if(file.relative.includes('file-system')) {
        return file
    } else if(file.isStream()) {
        let stream = through();
        stream.write(module);
        file.contents = stream;
        return file
    } else if(file.isBuffer()) {
        file.contents = new Buffer(module);
        return file
    } else {
        return file
    }
}

module.exports = () => {
    return through.obj(function(file, encoding, callback) {
        return callback(null, makeModule(file))
    });
};