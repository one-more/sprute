var fs = {
    readFileSync(path) {
        "use strict";

        return fileSystem.getFile(path, __dirname)
    }
};