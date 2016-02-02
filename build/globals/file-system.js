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

    getFile(path, __baseDir = '.') {
        "use strict";

        let baseDir;
        if(path[0] == '/') {
            baseDir = this.getDir('.');
            path = '.'+path
        } else {
            baseDir = this.getDir(__baseDir);
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
                throw new Error(`cannot find file ${path}`)
            })()
    },

    getDir(path) {
        "use strict";

        return path.split('/').filter(part => !!part).reduce((path, part) => {
            return path[part]
        }, this)
    }
};