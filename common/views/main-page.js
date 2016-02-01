'use strict';

let baseView = require(app.get('classPath')+'/views/base');

module.exports = class extends baseView {
    constructor() {
        super();

        this.setTemplateDir('main-page')
    }

    render() {
        return new Promise(resolve => {
            let html = this.getTemplate('index.tpl.html');
            resolve(html)
        })
    }
};