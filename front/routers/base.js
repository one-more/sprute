'use strict';

module.exports = class extends Backbone.Router {
    loadPage(domDocument) {
        this.trigger('PageLoaded')
    }
};