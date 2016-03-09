'use strict';

let fs = exports;

exports.F_OK = 0;
exports.R_OK = 4;
exports.W_OK = 2;
exports.X_OK = 1;

exports.readFile = (path, options, cb) => {
    if(typeof options == "function") {
        cb = options
    }
    try {
        cb(null, fs.readFileSync(path, options))
    } catch(e) {
        cb(e)
    }
};

exports.readFileSync = path => {
    return readFile(path).contents
};

exports.readdir = (path, cb) => {
    try {
        cb(null, fs.readdirSync(path))
    } catch(e) {
        cb(e)
    }
};

exports.readdirSync = path => {
    let dir = readDir(path);
    return Object.keys(dir).filter(key => typeof dir[key] == 'object')
};

exports.exists = (path, cb) => {
    try {
        cb(fs.existsSync(path))
    } catch(e) {
        cb(false)
    }
};

exports.existsSync = path => {
    return [readFile, readDir].reduce((condition, func) => {
        if(condition) {
            return condition
        }
        try {
            func(path);
            return true
        } catch(e) {}
    }, false)
};

exports.access = (path, mode, cb) => {
    if(typeof mode === 'function') {
        cb = mode;
        mode = fs.F_OK;
    } else if(typeof cb !== 'function') {
        throw new TypeError('callback must be a function');
    }

    try {
        fs.accessSync(path, mode);
        cb(null)
    } catch(e) {
        cb(e)
    }
};

exports.accessSync = (path, mode) => {
    !mode && (mode = fs.F_OK);
    mode = mode | 0;
    readFile(path);
    let filePerms = fs.F_OK | fs.R_OK;
    if(mode >= filePerms) {
        throw new Error('permission denied')
    }
};