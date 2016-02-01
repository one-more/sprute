window.require = (path, __baseDir) => {
    if(window[path]) {
        return window[path]
    } else {
        let file = fs.getFile(path, __baseDir);
        let module = {};
        let env = new Function('module', file);
        env(module);
        return module.exports
    }
};