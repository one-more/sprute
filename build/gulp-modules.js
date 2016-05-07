'use strict';

let through = require('through2'),
    process = require('process');

function makeModule(file) {
    if(!file.contents) {
        return file
    }

    let fileCopy = {};

    fileCopy.path = file.path.replace(process.cwd(), '');
    fileCopy.pathName = file.path.replace(file.cwd, '');
    fileCopy.name = file.path.split('/').slice(-1)[0];
    fileCopy.dirName = fileCopy.pathName.slice(0, -fileCopy.name.length);
    fileCopy.contents = file.contents.toString();

    let module = `loadFile(${JSON.stringify(fileCopy)});`;
    if(file.isStream()) {
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
    return through.obj((file, encoding, callback) => {
        return callback(null, makeModule(file))
    });
};