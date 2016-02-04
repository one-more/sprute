var fileSystem = {
    addFile(file) {
        "use strict";

        file.dirName = file.base.replace(file.cwd, '');
        file.pathName = file.path.replace(file.cwd, '');
        file.name = file.path.split('/').slice(-1)[0];
        let path = file.dirName;
        let dir = path.split('/').filter(part => !!part).reduce((tree, dir) => {
            return tree[dir] || (tree[dir] = {parent: tree})
        }, this);
        dir[file.path.split('/').slice(-1)] = file;
    },

    getDir(path, root) {
        "use strict";

        return path.split('/').reduce((path, part) => {
            if(part.trim() == '.' || part.trim() == '') {
                return path
            }
            if(part.trim() == '..') {
                return path.parent
            }
            return path[part]
        }, root)
    },

    getFile(path, __dirname) {
        "use strict";

        let baseDir = this.getDir(__dirname, this);
        return this.getDir(path, baseDir)
    },

    getContent(dir) {
        "use strict";

        let result = {};
        for(let key in dir) {
            let value = dir[key];
            if(this.isObject(value)) {
                result[key] = value
            }
        }
        return result
    },

    isObject(obj) {
        "use strict";

        return Object.prototype.toString.call(obj).includes('[object Object]')
    },

    isDir(obj) {
        "use strict";

        return this.isObject(obj) && !this.isFile(obj)
    },

    isFile(obj) {
        "use strict";

        return !!obj.pathName
    }
};