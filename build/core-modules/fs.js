let fs = exports;

exports.F_OK = 0;
exports.R_OK = 4;
exports.W_OK = 2;
exports.X_OK = 1;

exports.readFile = (path, options, cb) => {
    cb(readFile(path).contents)
};

exports.readFileSync = path => {
    return readFile(path).contents
};

exports.exists = (path, cb) => {
    try {
        cb(!!readFile(path).contents)
    } catch(e) {
        cb(false)
    }
};

exports.existsSync = path => {
    try {
        return !!readFile(path).contents
    } catch(e) {
        return false
    }
};

exports.readdir = (path, cb) => {
    try {
        cb(null, Object.keys(readDir(path)))
    } catch(e) {
        cb(e, [])
    }
};

exports.readdirSync = path => {
    return Object.keys(readDir(path))
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