'use strict';

let documentView = require('../views/document'),
    blocks = {};

module.exports = class {
    constructor(theme) {
        this.theme = theme
    }

    setBlock(name, data) {
        blocks[name] = data
    }

    toHTML() {
        let documentViewObj = new documentView(this.theme);
        return documentViewObj.render(blocks)
    }
};