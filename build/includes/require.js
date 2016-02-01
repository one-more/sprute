'use strict';

window.require = path => {
    let file = fs.getFile(path);
    let module = {};
    let env = new Function('module', file);
    env(module);
    return module.exports
};