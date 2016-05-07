'use strict';

let cwd = '/';

exports.cwd = () => cwd;

exports.chdir = path => {
    try {
        if(path.startsWith('./')) {
            var dir = readDir(cwd + '/' + path.slice(1));
        } else if(path.startsWith('../')) {
            dir = readDir(`${cwd}/${path}`)
        } else if(path.startsWith('/')) {
            dir = readDir(path);
        } else {
            dir = readDir('/' + path);
        }
        cwd = (dir && dir.pathName, dir.pathName) || '/'
    } catch(e) {
        throw new Error(`can not change dir to ${path}`)
    }
};

exports.env = {};

exports.nextTick = cb => {
    return function() {
        let prefixes = 'r webkitR mozR msR oR'.split(' '),
            nextTick = 'nextTick',
            i = 0,
            p = {};
        while(!p[nextTick] && i < prefixes.length) {
            p[nextTick] = window[prefixes[i++] + 'equestAnimationFrame']
        }
        return (p[nextTick] || (p[nextTick] = window.setImmediate || window.setTimeout))(cb)
    }()
};