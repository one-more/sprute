var fileSystem = {
    addFile(path, content) {
        "use strict";

        let dirs = path.split('/');
        let file = dirs.pop();
        let dir = dirs.reduce((path, part) => {
            return path[part] || (path[part] = {parent: path})
        }, this);
        dir[file] = content
    },

    getDir(path) {
        "use strict";

        return path.split('/').filter(part => !!part).reduce((path, part) => {
            return path[part]
        }, this)
    },

    getBaseDir(path, __baseDir = '.') {
        "use strict";

        if(path[0] == '/') {
            path = '.'+path;
            return this.getDir('.')
        } else {
            return this.getDir(__baseDir);
        }
    },

    getFromBaseDir(dirs, baseDir) {
        "use strict";

        return dirs.reduce((path, part) => {
            if(part.trim() == '.') {
                return path
            }
            if(part.trim() == '..') {
                return path.parent
            }
            return path[part]
        }, baseDir);
    },

    normalizePath(path) {
        "use strict";

        if(path[0] == '/') {
            return '.'+path
        }
        return path
    },

    getFile(path, __baseDir = '.') {
        "use strict";

        let baseDir = this.getBaseDir(path, __baseDir);
        let dirs = this.normalizePath(path).split('/');
        let file = dirs.pop();
        let dir = this.getFromBaseDir(dirs, baseDir);
        return dir[file] || (() => {
                throw new Error(`cannot find file ${path}`)
            })()
    },

    getDirContent(path, __baseDir) {
        "use strict";

        let baseDir = this.getBaseDir(path, __baseDir);
        let dirs = this.normalizePath(path).split('/');
        let dir = this.getFromBaseDir(dirs, baseDir);
        return _.pairs(dir).map(pair => {
            return pair[0].split('/').splice(-1)
        })
    }
};