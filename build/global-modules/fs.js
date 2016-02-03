var _fs = {
    readFileSync(path) {
        "use strict";

        return fileSystem.getFile(path, __dirname)
    },

    existsSync(path) {
        "use strict";

        try {
            fileSystem.getFile(path, __dirname);
            return true
        } catch(e) {
            return false
        }
    },

    readdirSync(path) {
        "use strict";

        return fileSystem.getDirContent(path, __dirname)
    }
};