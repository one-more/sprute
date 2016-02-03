'use strict';

let baseRouter = require(app.get('classPath')+'/routers/base'),
    domDocument = require(app.get('classPath')+'/classes/dom-document'),
    mainPageView = require('../views/main-page'),
    process = require('process'),
    theme = require(process.cwd()+'/configuration/theme-light'),
    domDocumentObj = new domDocument(theme);

module.exports = class extends baseRouter {
    index(req, res) {
        let mainPageViewObj = new mainPageView(theme);
        mainPageViewObj.render().then(html => {
            domDocumentObj.setBlock('main', html);
            this.loadPage(domDocumentObj, res)
        })
    }
};