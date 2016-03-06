'use strict';

let BaseRouter = require(app.get('classPath')+'/routers/base'),
    DomDocumentClass = require(app.get('classPath')+'/classes/dom-document'),
    themeTest = require('../../configuration/theme-test'),
    domDocument = new DomDocumentClass(themeTest);

module.exports = class extends BaseRouter {
    first(req, res) {
        let view = new (require('../views/first-page'))(themeTest);
        view.render().then(html => {
            domDocument.setBlock('main', html);
            this.loadPage(domDocument, res)
        })
    }

    second(req, res) {
        res.send('second page')
    }
}