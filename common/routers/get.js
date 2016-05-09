'use strict';

const BaseRouter = require(app.get('classPath')+'/routers/base'),
    process = require('process'),
    theme = require(process.cwd()+'/configuration/theme-light');

module.exports = class extends BaseRouter {
    constructor(params, DomDocument) {
        super(params);
        this.DomDocument = DomDocument || require(app.get('classPath')+'/classes/dom-document')
    }

    index(req, res) {
        const view = new (require('../views/main-page'))(theme),
            DomDocument = new this.DomDocument(theme);
        view.render().then(html => {
            DomDocument.setBlock('main', html);
            this.loadPage(DomDocument, res)
        })
    }
};