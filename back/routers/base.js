'use strict';

module.exports = class {
    loadPage(domDocument, res) {
        domDocument.toHTML().then(html => {
            res.send(html)
        })
    }
};