'use strict';

let cwd = '/';

exports.cwd = () => cwd;

exports.chdir = path => {
    try {
        if(path.startsWith('./')) {
            var dir = readDir(cwd+'/'+path.slice(1));
        } else if(path.startsWith('../')) {
            dir = readDir(`${cwd}/${path}`)
        } else if(path.startsWith('/')) {
            dir = readDir(path);
        } else {
            dir = readDir('/'+path);
        }
        cwd = dir.pathName || '/'
    } catch(e) {
        throw new Error(`can not change dir to ${path}`)
    }
};

exports.env = {};

exports.nextTick = cb => {
    return setTimeout(cb, 0)
};