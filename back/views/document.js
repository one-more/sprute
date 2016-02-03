'use strict';

let baseView = require(app.get('commonPath')+'/views/base'),
    process = require('process'),
    build = require(process.cwd()+'/configuration/build');

module.exports = class extends baseView {
    constructor(theme) {
        super();

        this.theme = theme;
        this.setTemplateDir(app.get('classPath')+'/templates/document')
    }

    render(blocks) {
        return new Promise(resolve => {
            let html = this.getTemplate('index.tpl.html', {
                blocks,
                bundleResult: require(build.bundleResult),
                theme: this.theme,
                build
            });
            resolve(html);
        })
    }
};