'use strict';

module.exports = class {
    loadPage(res, domDocument) {
        domDocument.toHTML().then(html => {
            res.send(html)
        })
    }
};