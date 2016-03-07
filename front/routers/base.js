'use strict';

let Backbone = require('backbone');

module.exports = class extends Backbone.Router {
    loadPage() {
        this.trigger('PageLoaded')
    }
};