'use strict';

let BaseRouter = require(app.get('classPath')+'/routers/base'),
    DomDocumentClass = require(app.get('classPath')+'/classes/dom-document'),
    themeTest = require('../../configuration/theme-test'),
    themeSecond = require('../../configuration/theme-second'),
    meta = require(app.get('commonPath')+'/modules/meta'),
    AjaxResponse = require(app.get('commonPath')+'/classes/ajax-response'),
    process = require('process'),
    seo = require('../../configuration/seo');

module.exports = class extends BaseRouter {
    first(req, res) {
        let domDocument = new DomDocumentClass(themeTest);
        domDocument.loadTheme().then(() => {
            let view = new (require('../views/first-page'))(themeTest);
            view.render().then(html => {
                domDocument.setBlock('main', html);
                domDocument.initViews(['action-button']);
                domDocument.setTitle(seo.page1.title);
                domDocument.setMeta([
                    new meta.Description(seo.page1.description),
                    new meta.Keywords(seo.page1.keywords)
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
                domDocument.initViews(['data-table', 'data-form', 'album-form']);
                domDocument.setTitle(seo.page2.title);
                domDocument.setMeta([
                    new meta.Description(seo.page2.description),
                    new meta.Keywords(seo.page2.keywords)
                ].reduce((meta, obj) => `${meta}\n${obj.toString()}`, ''));
                this.loadPage(domDocument, res);
            })
        })
    }

    addData(req, res) {
        let mapper = new (require('../mappers/mysql')),
            response = new AjaxResponse;

        let data = req.body;
        try {
            mapper.save(data).then(() => {
                response.status = AjaxResponse.statusOK;
                res.send(response)
            })
        } catch(e) {
            response.status = AjaxResponse.statusError;
            response.errors = mapper.validationErrors;
            res.send(response)
        }
    }

    uploadImages(req, res) {
        let formidable = require('formidable'),
            form = new formidable.IncomingForm(),
            response = new AjaxResponse;
        form.uploadDir = process.cwd()+'/static/images';
        form.keepExtensions = true;
        form.type = 'multipart/form-data';
        form.parse(req, function(err, fields, files) {
            response.status = AjaxResponse.statusOK;
            res.send(response)
        })
    }
}