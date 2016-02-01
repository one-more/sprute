'use strict';

let baseRouter = require(app.get('classPath')+'/routers/base'),
    domDocument = require(app.get('classPath')+'/classes/dom-document'),
    domDocumentObj = new domDocument;

module.exports = class extends baseRouter {
    index(req, res) {
        domDocumentObj.setBlock('main', 'main page');
        this.loadPage(domDocumentObj, res)
    }
};