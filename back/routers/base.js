'use strict';

module.exports = class {
    loadPage(res, domDocument) {
        res.send(+domDocument)
    }
};