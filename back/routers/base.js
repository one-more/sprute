'use strict';

let _ = require('underscore');

module.exports = class {
    constructor(options) {
        Object.assign(this, options);
        this._bindRoutes()
    }

    _bindRoutes() {
        if(this.routes) {
            _.pairs(this.routes).forEach(pair => {
                app.get('server').all(pair[0], this[pair[1]].bind(this))
            })
        }
    }

    loadPage(domDocument, res) {
        domDocument.toHTML().then(html => {
            res.send(html)
        })
    }
};