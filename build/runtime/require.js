window.require = require;

let cachedModules = {};

function require(module, __dirname, path) {
    "use strict";

    //in case it's global code
    if(arguments.length == 1) {
        module = {};
        __dirname = '';
        path = arguments[0]
    }

    if(window[path]) {
        return window[path]
    } else if(cachedModules[path]) {
        return cachedModules[path]
    } else {
        let file;
        if(isPathRelative(path)) {
            let baseDir = fileSystem.getDir(__dirname, fileSystem);
            if(file = getLocalModule(path, baseDir)) {
                return cachedModules[path] = runModule(module, file)
            }
        } else {
            if(file = getGlobalModule(path)) {
                return cachedModules[path] = runModule(module, file)
            }
        }
    }

    throw new Error(`cannot find module ${path}`)
}

function isPathRelative(path) {
    "use strict";

    return path[0] == '/' || path.slice(0,2) == './' || path.slice(0,3) == '../'
}

function loadAsFile(dir, fileName) {
    "use strict";

    if(fileSystem.isFile(dir[fileName])) {
        return dir[fileName]
    }
    if(fileSystem.isFile(dir[fileName+'.min.js'])) {
        return dir[fileName+'.min.js']
    }
    if(fileSystem.isFile(dir[fileName+'.js'])) {
        return dir[fileName+'.js']
    }
    if(fileSystem.isFile(dir[fileName+'.json'])) {
        return dir[fileName+'.json']
    }
}

function loadAsDirectory(dir) {
    "use strict";

    if(fileSystem.isFile(dir['package.json'])) {
        let pJ = JSON.parse(dir['package.json'].contents);
        let path = pJ.main;
        return getLocalModule(path, dir)
    }
    if(fileSystem.isFile(dir['bower.json'])) {
        let pJ = JSON.parse(dir['bower.json'].contents);
        let path = pJ.main;
        return getLocalModule(path, dir)
    }
    if(fileSystem.isFile(dir['index.js'])) {
        return dir['index.js']
    }
    if(fileSystem.isFile(dir['index.json'])) {
        return dir['index.json']
    }
}

function getLocalModule(path, baseDir) {
    "use strict";

    let file;
    let fileName = path.split('/').slice(-1)[0];
    let dirName = path.slice(0, -fileName.length);
    if(path[0] == '/') {
        var dir = fileSystem.getFile(dirName, '/')
    } else {
        dir = fileSystem.getDir(dirName, baseDir)
    }
    if(file = loadAsFile(dir, fileName)) {
        return file
    }
    if(fileSystem.isDir(dir[fileName])) {
        if(file = loadAsDirectory(dir[fileName])) {
            return file
        }
    }
}

function getGlobalModule(name) {
    "use strict";

    let result, calls = 0;
    function process(key, value) {
        let file;
        if(fileSystem.isDir(value) || fileSystem.isFile(value)) {
            if(file = getLocalModule(`./${name}`, value)) {
                return result = file
            }
        }

        return false
    }

    function traverse(tree, func) {
        //if(calls++ > 300) {
        //    throw new RangeError('Maximum call stack size exceeded')
        //}
        for(let key in tree) {
            if(tree.hasOwnProperty(key)) {
                let value = tree[key];
                if(func(key, value) || result) {
                    return
                }
                if(fileSystem.isDir(value) && key != 'parent') {
                    traverse(value, func);
                }
            }
        }
    }

    traverse(fileSystem, process);
    return result;
}

function runModule(currentModule, file) {
    "use strict";

    if(file.name.includes('.json')) {
        return JSON.parse(file.content)
    }

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