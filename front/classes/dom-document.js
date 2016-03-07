'use strict';

let $ = require('jquery');

module.exports = class {
    constructor(theme) {
        this.theme = theme
    }

    setBlock(name, content) {
        $(document.all[`${name}-block`]).html(content)
    }

    initViews(views) {
        views.forEach(name => {
            new (require(`${this.theme.viewsPath}/${name}`))(this.theme)
        })
    }
};