window.fs = (() => {
    "use strict";

    return {
        getFile(path) {
            return _.pairs(fileSystem).reduce((prev, curr) => {
                return curr[0].includes(path) ? curr : prev
            }, ['', ''])[1]
        }
    };
})();