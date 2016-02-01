window.fs = (() => {
    "use strict";

    let filesTree = {};
    function parseFileSystem() {
        _.pairs(fileSystem).forEach(pair => {
            let dirs = pair[0].split('/');
            let file = dirs.pop();
            let dir = dirs.reduce((path, part) => {
                return path[part] || (path[part] = {parent: path})
            }, filesTree);
            dir[file] = pair[1]
        })
    }
    parseFileSystem = _.once(parseFileSystem);

    function getDir(path) {
        return path.split('/').filter(part => !!part).reduce((path, part) => {
            return path[part]
        }, filesTree)
    }

    return {
        getFile(path, __baseDir = '.') {
            parseFileSystem();

            let baseDir;
            if(path[0] == '/') {
                baseDir = getDir('.');
                path = '.'+path
            } else {
                baseDir = getDir(__baseDir);
            }
            let dirs = path.split('/');
            let file = dirs.pop();
            let dir = dirs.reduce((path, part) => {
                if(part.trim() == '.') {
                    return path
                }
                if(part.trim() == '..') {
                    return path.parent
                }
                return path[part]
            }, baseDir);
            return dir[file.includes('.js') ? file : `${file}.js`] || (() => {
                    throw new Error(`cannot load file ${path}`)
                })()
        }
    };
})();