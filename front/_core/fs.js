'use strict';

window.fs = {
    getFile(path) {
        return _.pairs(fileSystem).reduce((prev, curr) => {
            return curr[0].contains(path) ? curr : prev
        }, ['', ''])[0]
    }
};