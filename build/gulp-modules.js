'use strict';

let through = require('through2'),
    _ = require('underscore');

function makeModule(file) {
    if(!file.contents) {
        return file
    }

    let fileCopy = _.clone(file);
    delete fileCopy._contents;
    delete fileCopy.stat;
    fileCopy.path = file.path;
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