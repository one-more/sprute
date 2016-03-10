'use strict';

let process = require('process'),
    documentView = require('../views/document');

module.exports = class {
    constructor(theme) {
        this.theme = theme;
        this.blocks = {
            init: '',
            main: '',
            title: '',
            meta: ''
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
        ['templatesPath', 'path', 'viewsPath'].forEach(key => {
            theme[key] = this.theme[key].replace(process.cwd(), '')
        });
        views.forEach(name => {
            let path = (this.theme.viewsPath.replace(process.cwd(), ''))+`/${name}`;
            this.blocks['init'] += `new (require('${path}'))(${JSON.stringify(theme)});`
        })
    }

    setTitle(title) {
        this.setBlock('title', title)
    }

    setMeta(meta) {
        this.setBlock('meta', meta)
    }

    toHTML() {
        let documentViewObj = new documentView(this.theme);
        return documentViewObj.render(this.blocks)
    }
};