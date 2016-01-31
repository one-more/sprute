'use strict';

let through = require('through2');

function makeModule(file) {
    let content = file.contents.toString();
    let wrapper = `function() { ${content.replace(/\s*module.exports\s*=\s*/, 'return ')} }`;
    return `fileSystem['${file.relative}'] = ${wrapper.toString()}`
}

module.exports = () => {
    return through.obj(function(file, encoding, callback) {
        callback(null, file.relative.includes('file-system') ? file : makeModule(file))
    });
};