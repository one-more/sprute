'use strict';

let baseView = require(app.get('commonPath')+'/views/base'),
    process = require('process'),
    buildConf = require(process.cwd()+'/configuration/build');

module.exports = class extends baseView {
    constructor() {
        super();

        this.setTemplateDir(app.get('theme').path+'/templates/document')
    }

    render(blocks) {
        return new Promise(resolve => {
            let html = this.getTemplate('index.tpl.html', {
                blocks,
                static: require(buildConf.buildResult)
            });
            resolve(html);
        })
    }
};