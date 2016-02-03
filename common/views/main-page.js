'use strict';

let baseView = require('./base'),
    process = require('process');

module.exports = class extends baseView {
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