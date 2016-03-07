'use strict';

let BaseView = require(app.get('commonPath')+'/views/base');

module.exports = class extends BaseView {
    constructor(theme) {
        super();

        this.setTemplateDir(theme.templatesPath+'/second-page');
        //this.addTemplateDir(theme.templatesPath+'/action-button')
    }

    render() {
        return new Promise(resolve => {
            let html = this.getTemplate('index.tpl.html');
            resolve(html)
        })
    }
};