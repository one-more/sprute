var require = (path) => {
    if(path == 'fs') {
        return _fs;
    } else if(window[path]) {
        return window[path]
    } else {
        if(!path.includes('.js')) {
            path += '.js'
        }
        let file = _fs.readFileSync(path);
        let module = {};
        let env = new Function('module', 'fileSystem', file);
        env(module, fileSystem);
        return module.exports
    }
};