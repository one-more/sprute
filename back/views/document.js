'use strict';

let baseView = require('./base'),
    fs = require('fs'),
    process = require('process'),
    buildConf = require(process.cwd()+'/configuration/build');

module.exports = class extends baseView {
    constructor() {
        super();
    }

    get templateDir() {
        return app.get('theme').path+'/templates/document'
    }

    render(blocks) {
        return new Promise(resolve => {
            let tpl = fs.readFileSync(this.templateDir+'/index.tpl.html', 'utf8');
            let html = this.getTemplate(tpl, {
                blocks,
                static: require(buildConf.buildResult)
            });
            resolve(html);
        })
    }
};