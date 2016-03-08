'use strict';

let process = require('process'),
    documentView = require('../views/document');

module.exports = class {
    constructor(theme) {
        this.theme = theme;
        this.blocks = {
            init: '',
            main: ''
        }
    }

    loadTheme() {
        return Promise.resolve()
    }

    setBlock(name, data) {
        this.blocks[name] = data
    }

    initViews(views) {
        let theme = {};
        theme.templatesPath = this.theme.templatesPath;
        theme.path = this.theme.path;
        views.forEach(name => {
            let path = (this.theme.viewsPath.replace(process.cwd(), ''))+`/${name}`;
            this.blocks['init'] += `new (require('${path}'))(${JSON.stringify(theme)});`
        })
    }

    toHTML() {
        let documentViewObj = new documentView(this.theme);
        return documentViewObj.render(this.blocks)
    }
};