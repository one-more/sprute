function require (module, baseDir, path) {
    "use strict";

    if(window[path]) {
        return window[path]
    } else {
        if(!path.includes('.js')) {
            path += '.js'
        }
        if(isModuleGlobal(path)) {
            file = fileSystem.findFile(path);
            !file && (() => {
                throw new Error(`cannot find ${path}`)
            })()
        } else {
            var file = fileSystem.getFile(path, baseDir)
        }
        return runModule(module, file)
    }
}

function isModuleGlobal(path) {
    "use strict";

    return path.split('/').length == 1
}

function runModule(currentModule, file) {
    "use strict";

    let module = {
        exports: {},
        filename: file.pathName,
        dirName: file.dirName,
        id: file.pathName,
        loaded: true,
        parent: currentModule
    }, exports = module.exports;
    let env = new Function('module', 'exports', 'require', file.contents);
    env(module, exports, require.bind(null, module, file.dirName));
    return module.exports
}