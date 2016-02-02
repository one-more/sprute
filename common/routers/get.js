'use strict';

let baseRouter = require(app.get('classPath')+'/routers/base'),
    domDocument = require(app.get('classPath')+'/classes/dom-document'),
    domDocumentObj = new domDocument,
    mainPageView = require('../views/main-page');

module.exports = class extends baseRouter {
    index(req, res) {
        let mainPageViewObj = new mainPageView;
        mainPageViewObj.render().then(html => {
            domDocumentObj.setBlock('main', html);
            this.loadPage(domDocumentObj, res)
        })
    }
};