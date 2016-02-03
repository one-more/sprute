var fileSystem = {
    addFile(file) {
        "use strict";

        file.dirName = file.base.replace(file.cwd, '');
        file.pathName = file.path.replace(file.cwd, '');
        file.name = file.path.split('/').slice(-1);
        let path = file.dirName;
        let dir = path.split('/').filter(part => !!part).reduce((tree, dir) => {
            return tree[dir] || (tree[dir] = {parent: tree})
        }, this);
        dir[file.path.split('/').slice(-1)] = file;
    },

    getFile(path, __baseDir) {
        "use strict";

        let baseDir = this.getDir(__baseDir, this);
        return this.getDir(path, baseDir) || (() => {
                throw new Error(`file ${path} does not exist`)
            })()
    },

    findFile(name) {
        "use strict";

        let objectValues = obj => Object.keys(obj).filter(key => key != 'parent').map(key => obj[key]);
        let isObject = obj => Object.prototype.toString.call(obj).includes('[object Object]');
        let iterates = 0;

        let search = (name, root) => {
            if(iterates++ > 300) {
                return
            }
            console.log(root);
            let values = objectValues(root);
            if(values.length == 0) {
                return
            }
            let child = {};
            for(let i = 0; i < values.length; i++) {
                if(isFile(values[i])) {
                    if(values[i].name == name) {
                        return file
                    }
                } else if(isObject(values[i])) {
                    child[i] = objectValues(values[i])
                }
            }
            return search(name, child)
        };

        let isFile = obj => !!obj.pathName;

        return search(name, this)
    },

    getDir(path, baseDir) {
        "use strict";

        return path.split('/').reduce((path, part) => {
            if(part.trim() == '.') {
                return path
            }
            if(part.trim() == '..') {
                return path.parent
            }
            return path[part]
        }, baseDir);
    }
};