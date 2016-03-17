'use strict';

let baseRouter = require(app.get('classPath')+'/routers/base'),
    DomDocument = require(app.get('classPath')+'/classes/dom-document'),
    process = require('process'),
    theme = require(process.cwd()+'/configuration/theme-light'),
    domDocumentObj = new DomDocument(theme);

module.exports = class extends baseRouter {
    index(req, res) {
        let mainPageView = new (require('../views/main-page'))(theme);
        mainPageView.render().then(html => {
            domDocumentObj.setBlock('main', html);
            this.loadPage(domDocumentObj, res)
        })
    }
};