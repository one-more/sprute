var require = (path) => {
    if(window[path]) {
        return window[path]
    } else {
        let file = fs.readFileSync(path);
        let module = {};
        let env = new Function('module', file);
        env(module);
        return module.exports
    }
};