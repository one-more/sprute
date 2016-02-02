var require = (path) => {
    if(window[path]) {
        return window[path]
    } else {
        let file = fs.readFileSync(path);
        let module = {};
        let env = new Function('module', 'fileSystem', file);
        env(module, fileSystem);
        return module.exports
    }
};