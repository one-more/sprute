'use strict';

let documentView = require('../views/document'),
    blocks = {};

module.exports = class {
    setBlock(name, data) {
        blocks[name] = data
    }

    toHTML() {
        let documentViewObj = new documentView;
        return documentViewObj.render(blocks)
    }
};