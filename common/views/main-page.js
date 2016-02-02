'use strict';

let baseView = require('./base'),
    process = require('process'),
    theme = require(process.cwd()+'/configuration/app').theme;

module.exports = class extends baseView {
    constructor() {
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