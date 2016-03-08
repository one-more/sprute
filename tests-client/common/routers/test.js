'use strict';

let BaseRouter = require(app.get('classPath')+'/routers/base'),
    DomDocumentClass = require(app.get('classPath')+'/classes/dom-document'),
    themeTest = require('../../configuration/theme-test'),
    themeSecond = require('../../configuration/theme-second');

module.exports = class extends BaseRouter {
    first(req, res) {
        let domDocument = new DomDocumentClass(themeTest);
        domDocument.loadTheme().then(() => {
            let view = new (require('../views/first-page'))(themeTest);
            view.render().then(html => {
                domDocument.setBlock('main', html);
                this.loadPage(domDocument, res);
                domDocument.initViews(['action-button']);
            })
        })
    }

    second(req, res) {
        let domDocument = new DomDocumentClass(themeSecond);
        domDocument.loadTheme().then(() => {
            let view = new (require('../views/second-page'))(themeSecond);
            view.render().then(html => {
                domDocument.setBlock('main', html);
                this.loadPage(domDocument, res);
                //domDocument.initViews(['action-button']);
            })
        })
    }
}