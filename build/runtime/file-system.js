var fileSystem = {
    addFile(file) {
        "use strict";

        let path = file.pathName.slice(0, -file.name.length);
        let dir = path.split('/').filter(part => !!part).reduce((tree, dir) => {
            return tree[dir] || (tree[dir] = {
                parent: tree,
                name: dir,
                get pathName() {
                    let parent, parts = [this.name], part = this;
                    while(parent = part.parent) {
                        parts.unshift(parent.name);
                        part = parent
                    }
                    return parts.join('/')
                }
            })
        }, this);
        dir[file.path.split('/').slice(-1)] = file;
    },

    isPathRelative(path) {
        "use strict";

        return path.startsWith('./') || path.startsWith('../')
    },

    getDir(path, root) {
        "use strict";

        if(this.isString(root)) {
            if(this.isPathRelative(path)) {
                root = this.getDir(root, this)
            } else {
                root = this
            }
        } else if(!this.isObject(root)) {
            root = this
        }

        return path.split('/').reduce((path, part) => {
            try {
                if(part.trim() == '.' || part.trim() == '') {
                    return path
                }
                if(part.trim() == '..') {
                    return path.parent || {}
                }
                return path[part]
            } catch(e) {
                //console.log(arguments[0], path, part);
                //console.log(e, e.stack)
            }
        }, root)
    },

    getFile(path, __dirname) {
        "use strict";

        return this.getDir(path, __dirname)
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

    isString(obj) {
        "use strict";

        return (Object.prototype.toString.call(obj) === '[object String]')
    },

    isDir(obj) {
        "use strict";

        return this.isObject(obj) && !this.isFile(obj)
    },

    isFile(obj) {
        "use strict";

        return this.isObject(obj) && !!obj.contents
    }
};

window.loadFile = (file) => {
    "use strict";

    fileSystem.addFile(file)
};

function readDir(__baseDir, path) { // eslint-disable-line no-unused-vars
    try {
        var dir = fileSystem.getDir(path, __baseDir);
    } catch(e) {
        throw new Error(`can not find dir ${path}`)
    }
    if(!fileSystem.isDir(dir)) {
        throw new Error(`${path} is not a directory`)
    }
    return dir
}

function readFile(__baseDir, path) { // eslint-disable-line no-unused-vars
    try {
        var file = fileSystem.getFile(path, __baseDir)
    } catch(e) {
        throw new Error(`can not find file ${path}`)
    }
    if(!fileSystem.isFile(file)) {
        throw new Error(`${path} is not a file`)
    }
    return file
}