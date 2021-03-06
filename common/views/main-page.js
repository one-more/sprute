'use strict';

let BaseView = require('./base');

module.exports = class extends BaseView {
    constructor(theme) {
        super();

        this.setTemplateDir(theme.templatesPath+'/main-page')
    }

    render() {
        return new Promise(resolve => {
            let html = this.getTemplate('index.tpl.html');
            resolve(html)
        })
    }
};