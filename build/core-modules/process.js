'use strict';

let cwd = '';

module.exports = {
    cwd() {
        return cwd
    },

    chdir(path) {
        try {
            if(path.startsWith('./')) {
                var dir = readDir(path.slice(1));
            } else if(path.startsWith('../')) {
                return
            } else if(path.startsWith('/')) {
                dir = readDir(path);
            } else {
                dir = readDir('/'+path);
            }
            cwd = dir.pathName
        } catch(e) {
            throw new Error(`can not change dir to ${path}`)
        }
    }
};