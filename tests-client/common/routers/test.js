'use strict';

let BaseRouter = require(app.get('classPath')+'/routers/base'),
    DomDocumentClass = require(app.get('classPath')+'/classes/dom-document'),
    themeTest = require('../../configuration/theme-test'),
    themeSecond = require('../../configuration/theme-second'),
    meta = require(app.get('commonPath')+'/modules/meta');

module.exports = class extends BaseRouter {
    first(req, res) {
        let domDocument = new DomDocumentClass(themeTest);
        domDocument.loadTheme().then(() => {
            let view = new (require('../views/first-page'))(themeTest);
            view.render().then(html => {
                domDocument.setBlock('main', html);
                domDocument.initViews(['action-button']);
                domDocument.setTitle('first page');
                domDocument.setMeta([
                    new meta.Description('isomorphic framework with robust architecture'),
                    new meta.Keywords(['framework', 'isomorphic', 'architecture'])
                ].reduce((meta, obj) => `${meta}\n${obj.toString()}`, ''));
                this.loadPage(domDocument, res);
            })
        })
    }

    second(req, res) {
        let domDocument = new DomDocumentClass(themeSecond);
        domDocument.loadTheme().then(() => {
            let view = new (require('../views/second-page'))(themeSecond);
            view.render().then(html => {
                domDocument.setBlock('main', html);
                domDocument.initViews(['data-table', 'data-form']);
                domDocument.setTitle('second page');
                domDocument.setMeta([
                    new meta.Description('second test page'),
                    new meta.Keywords(['framework', 'testing'])
                ].reduce((meta, obj) => `${meta}\n${obj.toString()}`, ''));
                this.loadPage(domDocument, res);
            })
        })
    }
}