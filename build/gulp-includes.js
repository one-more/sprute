'use strict';

let through = require('through2'),
    fs = require('fs'),
    path = require('path');

function include(file) {
    let content = file.contents.toString();
    let includes = '';
    let includesPath = __dirname+'/includes';
    fs.readdirSync(includesPath).forEach(file => {
        includes += fs.readFileSync(`${includesPath}/${file}`, 'utf8')
    });
    let result = `${includes + content}`;
    
    if(file.isStream()) {
        let stream = through();
        stream.write(result);
        file.contents = stream;
        return file
    } else if(file.isBuffer()) {
        file.contents = new Buffer(result);
        return file
    } else {
        return file
    }
}

module.exports = () => {
    return through.obj((file, encoding, callback) => {
        return callback(null, include(file))
    });
};