'use strict';

let baseRouter = require('../../back/routers/base'),
    domDocument = new require('../../back/classes/dom-document');

module.exports = class extends baseRouter {
    index(req, res) {
        domDocument.setBlock('main', 'main page');
        this.loadPage(res, domDocument)
    }
};